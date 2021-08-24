import Chart from 'chart.js/auto';

const canvas = document.getElementById('myChart');
if (!(canvas instanceof HTMLCanvasElement)) {
    throw new Error("#myChart is not a HTMLCanvasElement");
}

interface Label {
    path1: string;
    path2: string;
    value1: number;
    value2: number;
};
interface Point {
    x: number;
    y: number;
};

const labels: Label[] = [
    { path1: "1-1.txt", path2: "1-2.txt", value1: 1, value2: 2 },
    { path1: "2-1.txt", path2: "2-2.txt", value1: 3, value2: 4 },
    { path1: "3-1.txt", path2: "3-2.txt", value1: 5, value2: 6 },
    { path1: "4-1.txt", path2: "4-2.txt", value1: 7, value2: 8 },
];

const data: Point[] = labels.map(label => {
    return {
        x: label.value1,
        y: label.value2
    }
});

new Chart(
    canvas,
    {
        type: 'scatter',
        data: {
            labels: labels,
            datasets: [{
                data: data
            }]
        },
        options: {
            plugins: {
                tooltip: {
                    callbacks: {
                        label: (tooltipItem): string[] => {
                            const label = labels[tooltipItem.dataIndex];
                            return [
                                "path1: " + label.path1,
                                "path2: " + label.path2,
                                "value1: " + label.value1,
                                "value2: " + label.value2,
                            ];
                        }
                    }
                }
            }
        }
    }
);
