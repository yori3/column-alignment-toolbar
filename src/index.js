import { addFilter } from '@wordpress/hooks';
import { Fragment } from '@wordpress/element';
import { BlockControls } from '@wordpress/block-editor';
import { ToolbarGroup, ToolbarDropdownMenu } from '@wordpress/components';
import { createHigherOrderComponent } from '@wordpress/compose';

// カラムブロックに配置属性を追加
function addAlignmentAttribute(settings, name) {
    if (name !== 'core/columns') {
        return settings;
    }

    return {
        ...settings,
        attributes: {
            ...settings.attributes,
            columnAlignment: {
                type: 'string',
                default: 'flex-start'
            }
        }
    };
}

addFilter(
    'blocks.registerBlockType',
    'column-alignment-toolbar/add-attribute',
    addAlignmentAttribute
);

// ツールバーにドロップダウンメニューを追加
const withAlignmentControls = createHigherOrderComponent((BlockEdit) => {
    return (props) => {
        if (props.name !== 'core/columns') {
            return <BlockEdit {...props} />;
        }

        const { attributes, setAttributes } = props;
        const { columnAlignment } = attributes;

        const alignmentOptions = [
            { value: 'flex-start', label: '左寄せ', icon: 'editor-alignleft' },
            { value: 'center', label: '中央寄せ', icon: 'editor-aligncenter' },
            { value: 'flex-end', label: '右寄せ', icon: 'editor-alignright' },
            { value: 'space-between', label: '両端配置', icon: 'align-pull-left' },
            { value: 'space-around', label: '均等配置', icon: 'align-center' }
        ];

        const currentAlignment = alignmentOptions.find(
            option => option.value === columnAlignment
        );
        const currentIcon = currentAlignment ? currentAlignment.icon : 'editor-alignleft';

        return (
            <Fragment>
                <BlockControls>
                    <ToolbarGroup>
                        <ToolbarDropdownMenu
                            icon={currentIcon}
                            label="カラムの配置"
                            controls={alignmentOptions.map(option => ({
                                title: option.label,
                                icon: option.icon,
                                isActive: columnAlignment === option.value,
                                onClick: () => setAttributes({ columnAlignment: option.value })
                            }))}
                        />
                    </ToolbarGroup>
                </BlockControls>
                <BlockEdit {...props} />
            </Fragment>
        );
    };
}, 'withAlignmentControls');

addFilter(
    'editor.BlockEdit',
    'column-alignment-toolbar/with-controls',
    withAlignmentControls
);

// エディタ内でスタイルを適用
const withAlignmentStyles = createHigherOrderComponent((BlockListBlock) => {
    return (props) => {
        if (props.name !== 'core/columns') {
            return <BlockListBlock {...props} />;
        }

        const { attributes } = props;
        const { columnAlignment } = attributes;

        return (
            <BlockListBlock
                {...props}
                wrapperProps={{
                    ...props.wrapperProps,
                    style: {
                        ...props.wrapperProps?.style,
                        justifyContent: columnAlignment || 'flex-start'
                    }
                }}
            />
        );
    };
}, 'withAlignmentStyles');

addFilter(
    'editor.BlockListBlock',
    'column-alignment-toolbar/with-styles',
    withAlignmentStyles
);