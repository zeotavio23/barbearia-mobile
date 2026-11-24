@echo off
chcp 65001 >nul
echo === Criando o projeto Expo (pode demorar alguns minutos) ===
call npx create-expo-app@latest app --template blank-typescript
if errorlevel 1 goto erro
echo === Copiando o codigo da barbearia ===
copy /Y app-codigo\App.tsx app\App.tsx
xcopy /E /I /Y app-codigo\src app\src
cd app
echo === Instalando dependencias ===
call npx expo install @react-native-async-storage/async-storage react-native-safe-area-context expo-constants
call npx expo install react-dom react-native-web @expo/metro-runtime
if errorlevel 1 goto erro
echo.
echo PRONTO! Agora siga o LEIA-ME.txt (passos 2 e 3).
pause
exit /b 0
:erro
echo.
echo DEU ERRO. Tire um print desta tela e mande para o Claude.
pause
exit /b 1
