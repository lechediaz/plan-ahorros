# Descripción

Aplicación realizada con Ionic 6 y Angular para crear planes de ahorro.

## Comandos útiles

Añadir proyecto de Android Studio.

```
npx cap add android
```

Crear Splash screen e íconos.

```
npx capacitor-assets generate --assetPath ".\src\assets\" --android
```

Compilar.

```
ionic capacitor build android
```

Compilar y sincronizar assets.

```
ionic capacitor sync android
```

Abrir en IDE.

```
ionic capacitor open android
```

## Recomendación

Corregir problema de namespace: https://stackoverflow.com/questions/76108428/how-do-i-fix-namespace-not-specified-error-in-android-studio