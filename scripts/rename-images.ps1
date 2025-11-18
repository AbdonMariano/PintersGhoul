# Renombra las imágenes de assets/images usando una lista fija de nombres, preservando la extensión original
# Uso: Ejecutar desde la raíz del proyecto: powershell -ExecutionPolicy Bypass -File .\scripts\rename-images.ps1

param(
    [string]$ImagesDir = "$(Resolve-Path "$PSScriptRoot\..\assets\images")"
)

Write-Host "Directorio de imágenes:" $ImagesDir

# Nombres objetivo provistos por el usuario (en orden)
$targetNames = @(
    "TokyoGhoul_Gallery",
    "Ghoul_Collection01",
    "Ghoul_Collection02",
    "Ghoul_Collection03",
    "Masked_Archive",
    "RedAndBlack_Set",
    "TG_IconicShots",
    "TG_ArtworkFolder",
    "TG_BattleScenes",
    "TG_Wallpapers_HD",
    "TG_Characters_Set",
    "TG_DarkEdition",
    "TG_BestMoments",
    "TG_EmotionalScenes",
    "Ghoul_ShadowsFolder",
    "TG_LegendaryMoments",
    "TG_Re_Collection",
    "CCG_vs_Ghouls",
    "TG_EpicSet",
    "TG_SpecialEdition",
    "Kaneki_Pack",
    "Touka_Pack",
    "Juuzo_Pack",
    "Arima_Pack",
    "Rize_Pack",
    "Eto_Pack",
    "Tokyo_RedCity",
    "Ghoul_Universe",
    "TG_UltraPack",
    "DarkAnime_Pack",
    "TokyoGhoul_AestheticRed",
    "Kaneki_DarkVibes",
    "Touka_RainyNight",
    "Ghoul_Mask_Collection",
    "BloodMoon_Tokyo",
    "RedBlack_Theme",
    "Kaneki_Mirror",
    "Eyes_Transformation",
    "Mask_CloseUp",
    "Kaneki_Emotional",
    "Ghoul_Aura",
    "BrokenMask",
    "Rose_Gourmet",
    "Kaneki_CityLights",
    "Touka_NightSky",
    "Kagune_Flames",
    "Purple_Rize_Aura",
    "Owl_Shadow",
    "Kaneki_ArtworkStyle",
    "DarkTokyo_Street",
    "WhiteHair_Smoke",
    "Kaneki_HalfGhoul",
    "DarkAesthetic_Wall",
    "Kaneki_ArtRed",
    "Touka_DigitalArt",
    "Ghoul_EyeGlow",
    "MaskedShadow",
    "Rize_DemonLook",
    "Kaneki_Flames",
    "BrokenChains_Kaneki",
    "Kaneki_vs_Jason",
    "Kaneki_JasonChair",
    "Jason_Torture",
    "Kaneki_SnowFight",
    "Aogiri_Attack",
    "Anteiku_Battle",
    "Owl_vs_Arima",
    "CCG_Strike",
    "Arima_vs_Kaneki",
    "Touka_vs_Ayato",
    "Kaneki_vs_Amon",
    "Rize_AccidentScene",
    "Gourmet_vs_Kaneki",
    "Tsukiyama_Crazy",
    "Raid_on_CCG",
    "Cochlea_PrisonBreak",
    "Dragon_Kaneki",
    "Ghoul_War",
    "Hinami_Rescue",
    "Kaneki_Rebirth",
    "WhiteHair_Awakening",
    "Aogiri_Headquarters",
    "Kaneki_BloodyWalk",
    "Clown_Chaos",
    "Haise_vs_TorMent",
    "Kaneki_MentalBreak",
    "CCG_Operation",
    "Quinx_TeamBattle",
    "Rue_Island",
    "LastFinalBattle",
    "Kaneki_BlackReaper",
    "Kaneki_OneEyedGhoul",
    "Kaneki_MaskOn",
    "Kaneki_Antiguo",
    "Kaneki_Centipede",
    "Kaneki_HaiseMode",
    "Kaneki_DragonForm",
    "Touka_Smile",
    "Touka_BunnyMask",
    "Touka_Waitress",
    "Touka_BattleMode",
    "Touka_Re",
    "Juuzo_Suzuya",
    "Juuzo_Smile",
    "Juuzo_Battle",
    "Amon_Strict",
    "Amon_Investigator",
    "Amon_vs_Kaneki",
    "Rize_PurpleHair",
    "Rize_Hunter",
    "Rize_GhoulForm",
    "Hide_Smile",
    "Hide_YellowFriend",
    "Hide_Mystery",
    "Eto_OneEyedOwl",
    "Eto_GhoulForm",
    "Arima_WhiteReaper",
    "Arima_VS",
    "Hinami_Child",
    "Hinami_Ghoul"
)

# Preparar archivos
$files = Get-ChildItem -Path $ImagesDir -File | Where-Object { $_.Name -notmatch '^_filelist' } | Sort-Object Name

$filesCount = $files.Count
$namesCount = $targetNames.Count
$limit = [Math]::Min($filesCount, $namesCount)

Write-Host "Imagenes encontradas:" $filesCount
Write-Host "Nuevos nombres disponibles:" $namesCount
Write-Host "Se renombrarán:" $limit "archivos"

if ($limit -eq 0) {
  Write-Error "No hay archivos o nombres para procesar"
  exit 1
}

$logPath = Join-Path $PSScriptRoot 'rename-log.txt'
if (Test-Path $logPath) { Remove-Item $logPath -Force }

for ($i = 0; $i -lt $limit; $i++) {
  $file = $files[$i]
  $ext = $file.Extension
  $safeName = $targetNames[$i]
  $newName = "$safeName$ext"
  $newPath = Join-Path $ImagesDir $newName

  # Evitar colisión si ya existe (raro si nombres únicos)
  if (Test-Path $newPath) {
    $newName = "$safeName-dup$ext"
    $newPath = Join-Path $ImagesDir $newName
  }

  Write-Host ("{0} -> {1}" -f $file.Name, $newName)
  ("{0} -> {1}" -f $file.Name, $newName) | Out-File -FilePath $logPath -Append -Encoding UTF8

  Rename-Item -Path $file.FullName -NewName $newName -Force
}

# Regenerar listados auxiliares
Set-Location $ImagesDir
(Get-ChildItem -File | Sort-Object Name | Select-Object -ExpandProperty Name) | Set-Content -Encoding UTF8 _filelist.txt
(Get-ChildItem -File | Sort-Object Name) | ConvertTo-Json -Depth 5 | Set-Content -Encoding UTF8 _filelist.json

Write-Host "Renombrado completado. Log en $logPath"
