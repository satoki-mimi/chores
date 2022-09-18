import substance_painter

texture_sets = substance_painter.textureset.all_texture_sets()
type = substance_painter.textureset.ChannelType.BaseColor
format = substance_painter.textureset.ChannelFormat.sRGB8

for texture_set in texture_sets:
    stack = texture_set.get_stack()
    channels = stack.all_channels()
    for channel in channels:
        stack.remove_channel(channel)
    stack.add_channel(type,format)
