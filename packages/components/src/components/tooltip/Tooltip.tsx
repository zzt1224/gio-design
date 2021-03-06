import React, { useContext, useMemo, useEffect } from 'react';
import RcTooltip from 'rc-tooltip';
import { isFunction } from 'lodash';
import { TooltipProps } from './interface';
import { ConfigContext } from '../config-provider';
import Link from '../link';
import getPlacements from './placements';
import useControlledState from '../../utils/hooks/useControlledState';

const Tooltip = (props: TooltipProps): JSX.Element => {
  const {
    title,
    tooltipLink,
    placement = 'top',
    trigger = 'hover',
    visible,
    disabled = false,
    onVisibleChange,
    prefixCls: customizePrefixCls,
    overlay,
    children,
    arrowPointAtCenter = false,
    destroyTooltipOnHide,
    ...rest
  } = props;

  const [controlledVisible, setControlledVisible] = useControlledState<boolean>(visible, false);
  const [computedTitle, computedOverlay] = useMemo(
    () => [isFunction(title) ? title() : title, isFunction(overlay) ? overlay() : overlay],
    [title, overlay]
  );

  const isNoTitle = useMemo(() => !computedTitle && computedTitle !== 0, [computedTitle]);
  const isNoOverlay = useMemo(() => !computedOverlay && computedOverlay !== 0, [computedOverlay]);
  const isNoContent = useMemo(() => isNoTitle && isNoOverlay, [isNoTitle, isNoOverlay]);

  const { getPrefixCls } = useContext(ConfigContext);
  const prefixCls = getPrefixCls('tooltip', customizePrefixCls);

  useEffect(() => {
    setControlledVisible(!isNoContent && controlledVisible, true);
  }, [isNoContent, controlledVisible]);

  const tooltipOverlay = isNoTitle ? null : (
    <>
      <span className={`${prefixCls}-inner-title`}>{computedTitle}</span>
      {tooltipLink?.link && (
        <Link component="a" to={tooltipLink.link}>
          {tooltipLink.name || tooltipLink.link}
        </Link>
      )}
    </>
  );

  const setCursor = (child: React.ReactElement) => {
    if (trigger === 'click' || (Array.isArray(trigger) && trigger.includes('click'))) {
      return React.cloneElement(child, { style: { ...child.props.style, cursor: 'pointer' } });
    }
    return child;
  };

  const getOverlay = () => computedOverlay || tooltipOverlay;

  return (
    <RcTooltip
      prefixCls={prefixCls}
      placement={placement}
      trigger={trigger}
      transitionName="spread-transition"
      arrowContent={<span className={`${prefixCls}-arrow-content`} />}
      overlay={getOverlay()}
      builtinPlacements={getPlacements({ arrowPointAtCenter })}
      visible={controlledVisible && !disabled && !isNoContent}
      onVisibleChange={(_visible) => {
        setControlledVisible(_visible);
        if (!isNoContent) {
          onVisibleChange?.(_visible);
        }
      }}
      destroyTooltipOnHide={isNoContent || destroyTooltipOnHide}
      {...rest}
    >
      {setCursor(children)}
    </RcTooltip>
  );
};

export default Tooltip;
