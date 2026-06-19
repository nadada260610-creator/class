@echo off
set GIT_EXE=C:\Users\황령산PC-16\scoop\shims\git.exe
%GIT_EXE% init
%GIT_EXE% config user.name "AuthorBox Dev"
%GIT_EXE% config user.email "dev@authorbox.local"
%GIT_EXE% add .
%GIT_EXE% commit -m "feat: 오서박스 MVP - 구글 시트 연동 + Vercel 배포 설정"
%GIT_EXE% branch -M main
echo Git initialization complete.
