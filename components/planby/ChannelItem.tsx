import { Channel, ChannelBox, ChannelLogo } from 'planby'

//目前看到必要的props只有
// uuid: string;
// logo: string;
// position: {{top: number, left: number, width: number, height: number}, top | height}
interface ChannelItemProps {
  channel: Channel
}

export const ChannelItem = ({ channel }: ChannelItemProps) => {
  const { position, logo } = channel
  return (
    <ChannelBox {...position}>
      {/* Overwrite styles by add eg. style={{ maxHeight: 52, maxWidth: 52,... }} */}
      {/* Or stay with default styles */}
      <ChannelLogo
        src={logo}
        alt="Logo"
        style={{ maxHeight: 52, maxWidth: 52 }}
      />
    </ChannelBox>
  )
}
