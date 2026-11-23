# pages/

Пустая папка намеренно. Next ищет `pages/` сначала в корне, затем в `src/`. Без этой папки Next принял бы FSD-слой `src/pages` за Pages Router, и сборка упала бы с ошибкой «`pages` and `app` directories should be under the same folder».

Роутинг приложения — в корневой `app/` (App Router). Не добавляйте сюда файлы страниц.
