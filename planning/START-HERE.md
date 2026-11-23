# Как запустить проект со скиллами Matt Pocock

1. Создать репозиторий на GitHub, склонировать, распаковать сюда этот набор. `gh auth login`.
2. `/setup-matt-pocock-skills` — трекер: GitHub; domain docs: single-context (GLOSSARY.md + docs/adr/ уже лежат в корне). Скилл допишет блок `## Agent skills` в CLAUDE.md, создаст `docs/agents/*.md` и метки.
3. Закоммитить всё в `main`.
4. `/grill-with-docs` — дать ему `planning/brief.md`, `docs/ARCHITECTURE.md` и `planning/roadmap-draft.md` как исходный план. Он обновит GLOSSARY.md и при необходимости ADR.
5. `/to-spec` — spec MVP уйдёт в GitHub Issues.
6. `/to-tickets` — вертикальные срезы (tracer bullets) как issues с меткой `ready-for-agent`.
7. Цикл на каждый тикет: ветка → `/tdd` (или `/implement`) → `/code-review` → PR → merge.

`planning/` после шагов 5–6 можно удалить или оставить как историю.
