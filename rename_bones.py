import bpy

def rename_bones():
  for bone in bpy.context.active_object.data.bones:
    if '_L_' in bone.name:
      str = bone.name.replace('_L_', '_')
      str = str + '.L'
      bone.name = str
      print(str)
    if '_R_' in bone.name:
      str = bone.name.replace('_R_', '_')
      str = str + '.R'
      bone.name = str
      print(str)
  return

rename_bones()
