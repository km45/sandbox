import cytoscape from 'cytoscape';

const cy = cytoscape({
    container: document.getElementById('cy'),
    elements: {
        nodes: [
            { data: { id: 'a' } },
            { data: { id: 'b' } },
            { data: { id: 'c' } },

            { data: { id: 'a0', parent: 'a' } },
            { data: { id: 'b0', parent: 'b' } },
            { data: { id: 'b1', parent: 'b' } },
            { data: { id: 'b2', parent: 'b' } },
            { data: { id: 'c0', parent: 'c' } },
        ],
        edges: [

            // A -> B
            { data: { source: 'a', target: 'b' } },

            // B -> B
            { data: { source: 'b0', target: 'b1', customLabel: 'l01' } },
            { data: { source: 'b0', target: 'b2', customLabel: 'l02' } },
            { data: { source: 'b1', target: 'b0', customLabel: 'l10' } },
            { data: { source: 'b1', target: 'b2', customLabel: 'l12' } },
            { data: { source: 'b2', target: 'b0', customLabel: 'l20' } },
            { data: { source: 'b2', target: 'b1', customLabel: 'l21' } },

            // B -> C
            { data: { source: 'b', target: 'c' } },
        ]
    },
    style: [
        {
            selector: 'edge',
            style: {
                'target-arrow-shape': 'triangle',
                'curve-style': 'bezier',
                'label': 'data(customLabel)'
            }
        }, {
            selector: 'node',
            style: {
                'label': 'data(id)'
            }
        }
    ],
    layout: {
        name: 'cose'
    }
});
