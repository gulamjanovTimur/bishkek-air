// Эталонный словарь: его структура задаёт тип `Messages`, которому должны соответствовать остальные языки.
export const ru = {
  meta: {
    title: "Bishkek Air",
    description:
      "Интерактивная карта качества воздуха в Бишкеке: станции, индекс AQI и время обновления.",
  },
  appHeader: {
    title: "Bishkek Air",
  },
};

export type Messages = typeof ru;
