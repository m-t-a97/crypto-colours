import { Tooltip } from '@mui/material';
import { toSvg } from 'jdenticon';

type SvgTooltipIconProps = {
  data: string;
  size: number;
};

const SvgTooltipIcon = ({ data, size }: SvgTooltipIconProps) => {
  return (
    <Tooltip title={data}>
      <img
        src={`data:image/svg+xml;utf8,${encodeURIComponent(toSvg(data, size))}`}
      />
    </Tooltip>
  );
};

export default SvgTooltipIcon;
