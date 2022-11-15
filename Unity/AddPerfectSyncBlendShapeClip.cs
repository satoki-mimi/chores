using System.IO;
using UnityEditor;
using UnityEngine;
using UniGLTF;

namespace VRM
{
    public class AddPerfectSyncBlendShapeClip : MonoBehaviour
    {
        string[] shapeNames = new string[] {
            "BrowDownLeft",
            "BrowDownRight",
            "BrowInnerUp",
            "BrowOuterUpLeft",
            "BrowOuterUpRight",
            "CheekPuff",
            "CheekSquintLeft",
            "CheekSquintRight",
            "EyeBlinkLeft",
            "EyeBlinkRight",
            "EyeLookDownLeft",
            "EyeLookDownRight",
            "EyeLookInLeft",
            "EyeLookInRight",
            "EyeLookOutLeft",
            "EyeLookOutRight",
            "EyeLookUpLeft",
            "EyeLookUpRight",
            "EyeSquintLeft",
            "EyeSquintRight",
            "EyeWideLeft",
            "EyeWideRight",
            "JawForward",
            "JawLeft",
            "JawOpen",
            "JawRight",
            "MouthClose",
            "MouthDimpleLeft",
            "MouthDimpleRight",
            "MouthFrownLeft",
            "MouthFrownRight",
            "MouthFunnel",
            "MouthLeft",
            "MouthLowerDownLeft",
            "MouthLowerDownRight",
            "MouthPressLeft",
            "MouthPressRight",
            "MouthPucker",
            "MouthRight",
            "MouthRollLower",
            "MouthRollUpper",
            "MouthShrugLower",
            "MouthShrugUpper",
            "MouthSmileLeft",
            "MouthSmileRight",
            "MouthStretchLeft",
            "MouthStretchRight",
            "MouthUpperUpLeft",
            "MouthUpperUpRight",
            "NoseSneerLeft",
            "NoseSneerRight",
            "TongueOut"
        };

        // AssetsフォルダのVRMプレハブをセットしてもらう
        public GameObject VRMPrefab;

        // 縦の三点リーダーから関数を実行してもらう
        [ContextMenu("AddPerfectSyncBlendShapeClip")]
        public void AddBlendShapeClip()
        {
            var vrmPrefabPath = AssetDatabase.GetAssetPath(VRMPrefab);
            var ext = ".prefab";
            var blendShapePath = vrmPrefabPath.Replace(ext, ".BlendShapes/BlendShape.asset");
            var blendShapeAvatar = AssetDatabase.LoadAssetAtPath<BlendShapeAvatar>(blendShapePath);
            var manager = PreviewSceneManager.GetOrCreate(VRMPrefab);
            var proxy = manager.GetComponent<VRMBlendShapeProxy>();
            Mesh mesh = null;
            int blendShapeCount = 0;

            // BlendShapeがあるメッシュを特定する
            foreach (var transform in manager.Prefab.transform.GetChildren())
            {
                var skinnedMeshRenderer = transform.GetComponent<SkinnedMeshRenderer>();
                if (skinnedMeshRenderer != null)
                {
                    blendShapeCount = skinnedMeshRenderer.sharedMesh.blendShapeCount;
                    if (blendShapeCount != 0)
                    {
                        mesh = skinnedMeshRenderer.sharedMesh;
                        break;
                    }
                }
            }

            // Clipを追加してゆく
            for (int i = 0; i < shapeNames.Length; i++)
            {
                var assetName = shapeNames[i] + ".asset";
                var clipPath = blendShapePath.Replace("BlendShape.asset", assetName);
                if (!File.Exists(clipPath))
                { 
                    var clip = ScriptableObject.CreateInstance<BlendShapeClip>();
                    clip.name = shapeNames[i];
                    clip.BlendShapeName = shapeNames[i];
                    clip.Preset = BlendShapePreset.Unknown;
                    AssetDatabase.CreateAsset(clip, clipPath);
                    if (blendShapeAvatar.GetClip(shapeNames[i]) == null)
                    {
                        blendShapeAvatar.Clips.Add(clip);
                    }
                }
            }

            // Weightを設定してゆく
            var meshName = mesh.name.Replace(".baked","");
            for (int i = 0; i < blendShapeCount; i++)
            {
                var clip = proxy.BlendShapeAvatar.GetClip(mesh.GetBlendShapeName(i));
                if(clip != null) {
                    var BlendShapeIndex = mesh.GetBlendShapeIndex(clip.BlendShapeName);
                    if (BlendShapeIndex != -1)
                    {
                        var value = new BlendShapeBinding
                        {
                            RelativePath = meshName,
                            Index = BlendShapeIndex,
                            Weight = 100.0f
                        };
                        clip.Values = null;
                        clip.Values = new BlendShapeBinding[1] { value };
                    }
                }
            }
        }
    }
}
