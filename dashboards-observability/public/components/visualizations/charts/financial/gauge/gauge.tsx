/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo } from 'react';
import { indexOf } from 'lodash';
import Plotly from 'plotly.js-dist';
import { Plt } from '../../../plotly/plot';
import { NUMERICAL_FIELDS } from '../../../../../../common/constants/shared';
import { PLOTLY_GAUGE_COLUMN_NUMBER } from '../../../../../../common/constants/explorer';
import { DefaultGaugeChartParameters } from '../../../../../../common/constants/shared';
import { ThresholdUnitType } from '../../../../event_analytics/explorer/visualizations/config_panel/config_panes/config_controls/config_thresholds';

const { GaugeTitleSize, DisplayDefaultGauges, OrientationDefault } = DefaultGaugeChartParameters;
export const Gauge = ({ visualizations, layout, config }: any) => {
  const {
    data,
    metadata: { fields },
  } = visualizations.data.rawVizData;
  console.log('visualizations ====', visualizations);
  console.log('data at gauge chart==', data);
  const { dataConfig = {}, layoutConfig = {} } = visualizations.data.userConfigs;
  console.log('fields ====', fields);
  const dataConfigTab = visualizations?.data?.rawVizData?.Gauge?.dataConfig;
  console.log('dataConfigTab ===', dataConfigTab);
  const dimensions = dataConfigTab?.dimensions ? dataConfigTab?.dimensions : [];
  const metrics = dataConfigTab?.metrics ? dataConfigTab?.metrics : [];
  const dimensionsLength = dimensions.length && dimensions[0]?.name != '' ? dimensions.length : 0;
  const metricsLength = metrics.length && metrics[0]?.name != '' ? metrics.length : 0;
  console.log('dimensions ===', dimensions);
  console.log('metrics ====', metrics);
  console.log('dataConfig ===', dataConfig);
 
  const thresholds = dataConfig?.thresholds || [];
  const titleSize = dataConfig?.chartStyles?.titleSize || GaugeTitleSize;
  const valueSize = dataConfig?.chartStyles?.valueSize;
  const showThresholdMarkers = dataConfig?.chartStyles?.showThresholdMarkers || false;
  const showThresholdLabels = dataConfig?.chartStyles?.showThresholdLabels || false;
  const orientation = dataConfig?.chartStyles?.orientation || OrientationDefault;
  console.log(
    'showThresholdMarkers===',
    showThresholdMarkers,
    'showThresholdLabels',
    showThresholdLabels
  );

  const gaugeData: Plotly.Data[] = useMemo(() => {
    let calculatedGaugeData: Plotly.Data[] = [];
    if (dimensionsLength || metricsLength) {
      // case 1,2: no dimension, single/multiple metrics
      if (!dimensionsLength && metricsLength >= 1) {
        console.log('case 11111');
        console.log('QUERY DATA@@@ ====', data);
        calculatedGaugeData = metrics.map((metric: any) => {
          return {
            field_name: metric.name,
            value: data[metric.name][0],
          };
        });
      }

      if (dimensionsLength && metricsLength) {
        console.log('case 22222');
        console.log('QUERY DATA@@@ ====', data);
        metrics.map((metric: any) => {
          console.log('metrics map ==== metric', metric);
          console.log('data#####', data[metric.name].slice(0, DisplayDefaultGauges));
          calculatedGaugeData = [
            ...calculatedGaugeData,
            ...data[metric.name].slice(0, DisplayDefaultGauges).map((i: any, index: number) => {
              return {
                field_name: `${metric.name},${data[dimensions[0].name][index]}`,
                value: data[metric.name][index],
              };
            }),
          ];
        });
      }

      console.log('calculatedGaugeData ===', calculatedGaugeData);
      return calculatedGaugeData.map((gauge, index) => {
        return {
          type: 'indicator',
          mode: 'gauge+number+delta',
          value: gauge.value || 0,
          title: {
            text: gauge.field_name,
            font: { size: titleSize },
          },
          ...(valueSize && {
            number: {
              font: {
                size: valueSize,
              },
            },
          }),
          domain: {
            ...(orientation === 'auto' || orientation === 'h'
              ? {
                  row: Math.floor(index / PLOTLY_GAUGE_COLUMN_NUMBER),
                  column: index % PLOTLY_GAUGE_COLUMN_NUMBER,
                }
              : {
                  column: Math.floor(index / PLOTLY_GAUGE_COLUMN_NUMBER),
                  row: index % PLOTLY_GAUGE_COLUMN_NUMBER,
                }),
          },
          gauge: {
            // ...(showThresholdMarkers &&
            //   thresholds &&
            //   thresholds.length && {
            //     threshold: {
            //       line: { color: thresholds[0]?.color || 'red', width: 4 },
            //       thickness: 0.75,
            //       value: thresholds[0]?.value || 0,
            //     },
            //   }),

            //threshold labels
            ...(showThresholdLabels && thresholds && thresholds.length
              ? {
                  axis: {
                    ticktext: [gauge.value, ...thresholds.map((t: ThresholdUnitType) => t.name)],
                    tickvals: [gauge.value, ...thresholds.map((t: ThresholdUnitType) => t.value)],
                    ticklen: 5,
                  },
                }
              : {}),
            // multiple threshold markers!!!!
            ...(showThresholdMarkers &&
              thresholds &&
              thresholds.length && {
                steps: thresholds.map((threshold: ThresholdUnitType) => {
                  const value = Number(threshold.value);
                  return {
                    range: [value, value + 0.25] /*width needs improvement*/,
                    color: threshold.color || 'red',
                    name: threshold.name || '',
                    visible: true,
                  };
                }),
              }),
          },
        };
      });
    }
    return calculatedGaugeData;
  }, [
    dimensions,
    metrics,
    data,
    fields,
    thresholds,
    showThresholdMarkers,
    orientation,
    showThresholdLabels,
    titleSize,
    valueSize
  ]);

  const mergedLayout = useMemo(() => {
    const isAtleastOneFullRow = Math.floor(gaugeData.length / PLOTLY_GAUGE_COLUMN_NUMBER) > 0;
    return {
      grid: {
        ...(orientation === 'auto' || orientation === 'h'
          ? {
              rows: Math.floor(gaugeData.length / PLOTLY_GAUGE_COLUMN_NUMBER) + 1,
              columns: isAtleastOneFullRow ? PLOTLY_GAUGE_COLUMN_NUMBER : gaugeData.length,
            }
          : {
              columns: Math.floor(gaugeData.length / PLOTLY_GAUGE_COLUMN_NUMBER) + 1,
              rows: isAtleastOneFullRow ? PLOTLY_GAUGE_COLUMN_NUMBER : gaugeData.length,
            }),
        pattern: 'independent',
      },
      ...layout,
      ...(layoutConfig.layout && layoutConfig.layout),
      title: dataConfig?.panelOptions?.title || layoutConfig.layout?.title || '',
    };
  }, [
    data,
    layout,
    gaugeData.length,
    layoutConfig.layout,
    dataConfig?.panelOptions?.title,
    orientation,
  ]);

  const mergedConfigs = {
    ...config,
    ...(layoutConfig.config && layoutConfig.config),
  };
  console.log('gauge data----', gaugeData);
  return <Plt data={gaugeData} layout={mergedLayout} config={mergedConfigs} />;
};
