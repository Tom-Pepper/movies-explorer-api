# movies-explorer-api
Бэкенд для Movies Explorer — дипломного проекта Яндекс.Практикум

---

### Запросы:
- `POST /signup` — регистрация пользователя. Передать в body JSON с полями `name`, `email`, `password`
- `POST /signin` — авторизация. Передать в body `email` и `password`. Возвращает JWT
- `GET /users/me` — возвращает данные о залогиненном пользователе. В заголовках должен быть указан Authorization с токеном
из прошлого пункта (перед токеном не забыть прописать `Bearer`)
- `PATCH /users/me` — изменение данных пользователя. Принимает новые `name` и `email`
- `GET /movies` — возвращает список сохраненных фильмов. Только авторизованным пользователям
- `POST /movies` — создает новый фильм. Принимает объект с полями `country`, `director`, `duration`, `year`, `description`,
`image`, `trailer`, `thumbnail`, `movieId`, `nameRU`, `nameEN`
- `DELETE /movies/:movieId` — удаление фильма из БД. Удалять можно только созданные пользователем карточки

[-> Протестировать API <-](api.pepperjs.nomoredomains.club)
