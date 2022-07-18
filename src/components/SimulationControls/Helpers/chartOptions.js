import { ref } from "vue";

export default function () {
  return {
    type: "line",
    data: {
      datasets: [
        {
          backgroundColor: "#cfcfcf",
          data: [{ x: 0.0, y: 11100 }],
        },
      ],
    },
    options: {
      maintainAspectRatio: false,
      animation: { duration: 0 },
      elements: {
        line: { tension: 0, borderColor: "#cfcfcf", borderWidth: "1" },
      },
      scales: {
        x: {
          type: "linear",
          title: { display: true, text: ref("") },
        },
        y: {
          type: "linear",
          title: { display: true, text: ref("") },
        },
      },
      plugins: {
        title: {
          text: ref(""),
          display: true,
        },
        legend: {
          display: false,
        },
        tooltip: {
          enabled: false,
        },
        zoom: {
          zoom: {
            wheel: {
              enabled: true,
            },
            pinch: {
              enabled: true,
            },
            mode: "y",
          },
        },
        annotation: ref(null),
      },
    },
  };
}
