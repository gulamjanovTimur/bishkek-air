// Reference dictionary: its shape defines the `Messages` type that every other locale must match.
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
