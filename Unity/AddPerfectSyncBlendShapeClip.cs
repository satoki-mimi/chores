using System.IO;
using UnityEditor;
using UnityEngine;

namespace VRM
{
    public class AddPerfectSyncBlendShapeClip : MonoBehaviour
    {
        // AssetsフォルダのVRMプレハブをセットしてもらう
        public GameObject VRMPrefab;
        // 縦の三点リーダーから関数を実行してもらう
        [ContextMenu("AddPerfectSyncBlendShapeClip")]
        public void AddBlendShapeClip()
        {
            // パスを特定する
            var vrmPrefabPath = AssetDatabase.GetAssetPath(VRMPrefab);
            var ext = ".prefab";
            var blendShapePath = vrmPrefabPath.Replace(ext, ".BlendShapes/BlendShape.asset");

            // アバターをロードする
            var blendShapeAvatar = AssetDatabase.LoadAssetAtPath<BlendShapeAvatar>(blendShapePath);

            // BlendShapeがあるメッシュを特定する
            Mesh mesh = null;
            int blendShapeCount = 0;
            int transformCount = VRMPrefab.transform.childCount;
            for (int i = 0; i < transformCount; i++)
            {
                var transform = VRMPrefab.transform.GetChild(i);
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
            for (int i = 0; i < blendShapeCount; i++)
            {
                var name = mesh.GetBlendShapeName(i);
                var assetName = name + ".asset";
                var clipPath = blendShapePath.Replace("BlendShape.asset", assetName);
                var DefaultClipPath = blendShapePath.Replace(".asset", "." + assetName);
                if (!File.Exists(clipPath) && !File.Exists(DefaultClipPath))
                {
                    var clip = ScriptableObject.CreateInstance<BlendShapeClip>();
                    clip.name = name;
                    clip.BlendShapeName = name;
                    clip.Preset = BlendShapePreset.Unknown;
                    AssetDatabase.CreateAsset(clip, clipPath);
                    if (blendShapeAvatar.GetClip(name) == null)
                    {
                        blendShapeAvatar.Clips.Add(clip);
                    }
                }
            }

            // Weightを設定してゆく
            var proxy = VRMPrefab.GetComponent<VRMBlendShapeProxy>();
            var meshName = mesh.name.Replace(".baked", "");
            for (int i = 0; i < blendShapeCount; i++)
            {
                for (int j = 0; j < proxy.BlendShapeAvatar.Clips.Count; j++)
                {
                    var clip = proxy.BlendShapeAvatar.Clips[j];
                    if (mesh.GetBlendShapeName(i) == clip.BlendShapeName)
                    {
                        var value = new BlendShapeBinding
                        {
                            RelativePath = meshName,
                            Index = i,
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
