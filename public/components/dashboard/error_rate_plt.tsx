import { EuiHorizontalRule, EuiPanel } from '@elastic/eui';
import _ from 'lodash';
import React from 'react';
import { PanelTitle } from '../common';
import { Plt } from '../common/plt';

export function ErrorRatePlt(props: { items: Plotly.Data[] }) {
  const layout = {
    width: 400,
    height: 217,
    margin: {
      l: 50,
      r: 5,
      b: 50,
      t: 30, // 10
      pad: 4,
    },
    annotations: props.items.length > 0 && [
      {
        x: props.items[0]?.x[props.items[0]?.x.length - 1],
        y: 0,
        showarrow: true,
        arrowhead: 0,
        xref: 'x',
        yref: 'y',
        text: `Now: ${props.items[0]?.y[props.items[0]?.y.length - 1]}%`,
        ax: 0,
        ay: -140,
        borderpad: 10,
        arrowwidth: 0.7,
      },
    ],
    showlegend: false,
    xaxis: {
      fixedrange: true,
      showgrid: false,
      visible: true,
      color: '#899195',
    },
    yaxis: {
      title: {
        text: 'Error rate',
        font: {
          size: 12,
        },
      },
      range: [0, Math.min(20, Math.max(...props.items.map((item) => item?.y)))],
      fixedrange: true,
      ticksuffix: '%',
      gridcolor: '#d9d9d9',
      showgrid: true,
      // showline: true,
      // zeroline: true,
      visible: true,
      color: '#899195',
    },
  } as Partial<Plotly.Layout>;

  return (
    <>
      <EuiPanel>
        <PanelTitle title="Error rate over time" />
        <EuiHorizontalRule margin="m" />
        <Plt data={props.items} layout={layout} />
      </EuiPanel>
    </>
  );
}
