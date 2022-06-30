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
  const { dataConfig = {}, layoutConfig = {} } = visualizations.data.userConfigs;
  console.log('data ====', data);
  console.log('fields ====', fields);
  const dataConfigTab = visualizations?.data?.rawVizData?.Gauge?.dataConfig;
  console.log('dataConfigTab ===', dataConfigTab);
  const dimensions = dataConfigTab?.dimensions ? dataConfigTab?.dimensions : [];
  const metrics = dataConfigTab?.metrics ? dataConfigTab?.metrics : [];
  const dimensionsLength = dimensions.length && dimensions[0]?.name != "" ? dimensions.length : 0
  const metricsLength = metrics.length && metrics[0]?.name != "" ? metrics.length : 0
  console.log('dimensions ===', dimensions);
  console.log("metrics ====", metrics)
  console.log('dataConfig ===', dataConfig);
  console.log("dimensionsLength", dimensionsLength, "metricsLength", metricsLength)
  // const series =
  //   dataConfig?.valueOptions && dataConfig?.valueOptions?.series
  //     ? dataConfig.valueOptions.series
  //     : [];

  // const value =
  //   dataConfig?.valueOptions && dataConfig?.valueOptions?.value
  //     ? dataConfig.valueOptions.value
  //     : [];

  const thresholds = dataConfig?.thresholds || [];
  const titleSize = dataConfig?.chartStyles?.titleSize || GaugeTitleSize;
  const valueSize = dataConfig?.chartStyles?.valueSize;
  const showThresholdMarkers = dataConfig?.chartStyles?.showThresholdMarkers || false;
  const showThresholdLabels = dataConfig?.chartStyles?.showThresholdLabels || false;
  const orientation = dataConfig?.chartStyles?.orientation || OrientationDefault;
  console.log('orientation ===', orientation);
  const gaugeData: Plotly.Data[] = useMemo(() => {
    let calculatedGaugeData: Plotly.Data[] = [];
    if (dimensionsLength || metricsLength) {

      // case 1: no dimension, single metric
      if(!dimensionsLength && metricsLength === 1){
        console.log("case 11111")



      }

      // if (indexOf(NUMERICAL_FIELDS, series[0].type) > 0) {
      //   console.log('NUMERIC VALUE =======');
      //   if (value && value[0]) {
      //     console.log('value is selected ====', value);
      //     calculatedGaugeData = [
      //       ...data[value[0].name].map((dimesionSlice, index) => ({
      //         field_name: dimesionSlice,
      //         value: data[series[0].name][index],
      //       })),
      //     ];
      //   } else {
      //     console.log('no value seleceted =====');
      //     calculatedGaugeData = [
      //       ...data[series[0].name].slice(0, DisplayDefaultGauges).map((dimesionSlice, index) => ({
      //         field_name: dimesionSlice,
      //         value: data[series[0].name][index],
      //       })),
      //     ];
      //   }
      // } else {
      //   console.log('NON--NUMERIC VALUE =======');
      //   if (value && value[0]) {
      //     console.log('value selected ====');
      //     value.map((val) => {
      //       console.log('val map ===', val);
      //       const selectedSeriesIndex = indexOf(data[series[0].name], val.name);
      //       console.log('selectedSeriesIndex===', selectedSeriesIndex);
      //       fields.map((field) => {
      //         console.log('in fields map ====field', field);
      //         if (field.name !== series[0].name) {
      //           calculatedGaugeData.push({
      //             field_name: field.name,
      //             value: data[field.name][selectedSeriesIndex],
      //           });
      //         }
      //       });
      //     });
      //   } else {
      //     console.log('no value slected =====');
      //     const values = data[series[0].name].slice(0, DisplayDefaultGauges).map((i) => {
      //       return {
      //         name: i,
      //         custom_label: series[0].custom_label !== '' ? series[0].custom_label : i,
      //         type: series[0].type,
      //         label: i,
      //       };
      //     });
      //     console.log('filters values from fields', values);
      //     values.map((val) => {
      //       console.log('val map ===', val);
      //       const selectedSeriesIndex = indexOf(data[series[0].name], val.name);
      //       console.log('selectedSeriesIndex===', selectedSeriesIndex);
      //       fields.map((field) => {
      //         console.log('in fields map ====field', field);
      //         if (field.name !== series[0].name) {
      //           calculatedGaugeData.push({
      //             field_name: val.custom_label ? val.custom_label : val.name,
      //             // field_name: val.name,
      //             value: data[field.name][selectedSeriesIndex],
      //           });
      //         }
      //       });
      //     });
      //   }
      // }

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
  }, [dimensions, metrics, data, fields, thresholds]);

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
  }, [data, layout, gaugeData.length, layoutConfig.layout, dataConfig?.panelOptions?.title]);

  const mergedConfigs = {
    ...config,
    ...(layoutConfig.config && layoutConfig.config),
  };

  console.log("gaugeData=====", gaugeData)
  return <Plt data={gaugeData} layout={mergedLayout} config={mergedConfigs} />;
};
