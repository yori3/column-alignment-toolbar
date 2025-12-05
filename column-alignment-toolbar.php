<?php
/**
 * Plugin Name: Column Alignment Toolbar
 * Plugin URI: https://example.com
 * Description: カラムブロックのツールバーに配置ボタンを追加します
 * Version: 1.0.0
 * Author: Your Name
 * Author URI: https://example.com
 * License: GPL v2 or later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: column-alignment-toolbar
 */

// 直接アクセスを防ぐ
if (!defined('ABSPATH')) {
    exit;
}

class Column_Alignment_Toolbar {
    
    private static $instance = null;
    
    public static function get_instance() {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }
    
    private function __construct() {
        add_action('enqueue_block_editor_assets', array($this, 'enqueue_editor_assets'));
        add_filter('render_block', array($this, 'add_alignment_to_frontend'), 10, 2);
    }
    
    /**
     * エディタ用のアセットをエンキュー
     */
    public function enqueue_editor_assets() {
        $script_path = plugin_dir_path(__FILE__) . 'build/index.js';
        $script_url = plugins_url('build/index.js', __FILE__);
        
        // ファイルが存在するか確認
        if (!file_exists($script_path)) {
            error_log('Column Alignment Toolbar: JSファイルが見つかりません - ' . $script_path);
            return;
        }
        
        wp_enqueue_script(
            'column-alignment-toolbar-script',
            $script_url,
            array('wp-blocks', 'wp-element', 'wp-components', 'wp-block-editor', 'wp-compose', 'wp-hooks'),
            filemtime($script_path), // キャッシュ対策
            true
        );
    }
    
    /**
     * フロントエンドに配置スタイルを適用
     */
    public function add_alignment_to_frontend($block_content, $block) {
        if ($block['blockName'] === 'core/columns' && !empty($block['attrs']['columnAlignment'])) {
            $alignment = esc_attr($block['attrs']['columnAlignment']);
            
            // wp-block-columnsクラスを持つ要素にスタイルを追加
            $block_content = preg_replace(
                '/<div class="([^"]*wp-block-columns[^"]*)"/',
                '<div class="$1" style="justify-content: ' . $alignment . ';"',
                $block_content,
                1
            );
        }
        return $block_content;
    }
}

// プラグインを初期化
Column_Alignment_Toolbar::get_instance();