using System.IO;
using UnityEditor;
using UnityEngine;

namespace UniVRM10
{
    public class AddPerfectSyncExpression : MonoBehaviour
    {
        string[] keyNames = new string[] {
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
        public GameObject vrmAsset;
        
        // 縦の三点リーダーから関数を実行してもらう
        [ContextMenu("AddPerfectSyncExpression")]
        public void AddBlendShapeClip()
        {
            // パス特定
            var vrmAssetPath = AssetDatabase.GetAssetPath(vrmAsset);
            var vrmAssetName = vrmAsset.name + ".vrm";
            var clipAssetFolderName = vrmAsset.name + ".vrm1.Assets";
            var clipAssetFolderPath = vrmAssetPath.Replace(vrmAssetName, clipAssetFolderName);
            if (!Directory.Exists(clipAssetFolderPath)){
                Directory.CreateDirectory(clipAssetFolderPath);
            }

            // vrmのinstanceを用意する
            var instance = AssetDatabase.LoadAssetAtPath<Vrm10Instance>(vrmAssetPath);

            // BlendShapeがあるmeshを特定する
            Mesh mesh = null;
            var meshName = "";
            int blendShapeCount = 0;
            foreach (var transform in instance.transform.GetChildren())
            {
                var skinnedMeshRenderer = transform.GetComponent<SkinnedMeshRenderer>();
                if (skinnedMeshRenderer != null)
                {
                    blendShapeCount = skinnedMeshRenderer.sharedMesh.blendShapeCount;
                    if (blendShapeCount != 0)
                    {
                        mesh = skinnedMeshRenderer.sharedMesh;
                        meshName = mesh.name.Replace(".baked", ""); // Replace必要？
                        break;
                    }
                }
            }

            // clipのassetを作成して、instanceに追加する
            for (int i = 0; i < keyNames.Length; i++) {
                var clipPath = clipAssetFolderPath + "/" + keyNames[i] + ".asset";
                if (!File.Exists(clipPath))
                {
                    var key = ExpressionKey.CreateCustom(keyNames[i]);
                    var clip = ScriptableObject.CreateInstance<VRM10Expression>();
                    clip.Prefab = vrmAsset;
                    clip.IsBinary = false;
                    clip.name = key.Name;
                    AssetDatabase.CreateAsset(clip, clipPath);
                    instance.Vrm.Expression.AddClip(key.Preset, clip);
                }
            }

            // blendShapeと同名のpresetのclipがあれば、weightを設定する
            foreach (var clip in instance.Vrm.Expression.Clips)
            {
                var idx = mesh.GetBlendShapeIndex(clip.Clip.name);
                if (idx != -1)
                {
                    clip.Clip.Prefab = vrmAsset;
                    var MTB = new MorphTargetBinding
                    {
                        Index = idx,
                        RelativePath = meshName,
                        Weight = 1.0f
                    };
                    clip.Clip.MorphTargetBindings = null;
                    clip.Clip.MorphTargetBindings = new MorphTargetBinding[] { MTB };
                }
            }
        }
    }
}
