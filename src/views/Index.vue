<template>
  <div>
    <div id="main" style="height:100px;"></div>
    <div id="chart-container" style="height:600px;" ref="chart"></div>
  </div>
</template>
<script>
import * as echarts from 'echarts';
import request from "@/utils/request";

export default {
  data() {
    return {
      data:[]
    };
  },
  activated() {
    this.getDataList();
  },
  methods: {
    getDataList() {
      request({
        url: "/ip/data",
        method: "get",
      }).then(({ data }) => {
        //name 和value 貌似是必须的 不想查文档了就这样把
        console.log(data);
        // const ROOT_PATH = 'https://fastly.jsdelivr.net/gh/apache/echarts-website@asf-site/examples';
        //
        // const weatherIcons = {
        //   Sunny: ROOT_PATH + '/data/asset/img/weather/sunny_128.png',
        //   Cloudy: ROOT_PATH + '/data/asset/img/weather/cloudy_128.png',
        //   Showers: ROOT_PATH + '/data/asset/img/weather/showers_128.png'
        // };
        let dataList=[];
        for (let i = 0; i < data.length; i++) {
          dataList.push(
            {
              name: data[i].country??"不明国家",
              value: data[i].count,
              city: data[i].cityInfos
            }
          )
          // dataList.push(
          //   {
          //     name: data[i].country??"不明国家",
          //     value: data[i].count,
          //     label: {
          //       formatter: [
          //         '{title|{b}}{abg|}',
          //         '  {weatherHead|City}{cityHead|City}{valueHead|Count}{rateHead|post code}',
          //         '{hr|}',
          //         '  {Sunny|}{value|'+data[i].count+'}{rate|55.3%}',
          //         '  {City|}{value|'+data[i].name+'}{rate|55.3%}',
          //         '  {Cloudy|}{value|'+data[i].count+'}{rate|38.9%}',
          //         '  {Showers|}{value|'+data[i].count+'}{rate|5.8%}'
          //       ].join('\n'),
          //       backgroundColor: '#eee',
          //       borderColor: '#777',
          //       borderWidth: 1,
          //       borderRadius: 4,
          //       rich: {
          //         title: {
          //           color: '#eee',
          //           align: 'center'
          //         },
          //         abg: {
          //           backgroundColor: '#333',
          //           width: '100%',
          //           align: 'right',
          //           height: 25,
          //           borderRadius: [4, 4, 0, 0]
          //         },
          //         Sunny: {
          //           height: 30,
          //           align: 'left',
          //           backgroundColor: {
          //             image: weatherIcons.Sunny
          //           }
          //         },
          //         Cloudy: {
          //           height: 30,
          //           align: 'left',
          //           backgroundColor: {
          //             image: weatherIcons.Cloudy
          //           }
          //         },
          //         Showers: {
          //           height: 30,
          //           align: 'left',
          //           backgroundColor: {
          //             image: weatherIcons.Showers
          //           }
          //         },
          //         weatherHead: {
          //           color: '#333',
          //           height: 24,
          //           align: 'left'
          //         },
          //         hr: {
          //           borderColor: '#777',
          //           width: '100%',
          //           borderWidth: 0.5,
          //           height: 0
          //         },
          //         city: {
          //           width: 20,
          //           padding: [0, 20, 0, 30],
          //           align: 'center'
          //         },
          //         cityHead: {
          //           color: '#333',
          //           width: 20,
          //           padding: [0, 20, 0, 30],
          //           align: 'center'
          //         },
          //         value: {
          //           width: 20,
          //           padding: [0, 20, 0, 30],
          //           align: 'center'
          //         },
          //         valueHead: {
          //           color: '#333',
          //           width: 20,
          //           padding: [0, 20, 0, 30],
          //           align: 'center'
          //         },
          //         rate: {
          //           width: 40,
          //           align: 'right',
          //           padding: [0, 10, 0, 0]
          //         },
          //         rateHead: {
          //           color: '#333',
          //           width: 40,
          //           align: 'center',
          //           padding: [0, 10, 0, 0]
          //         }
          //       }
          //     }
          //   }
          // )
        }
        this.data = dataList;

       this.$nextTick(() => {
         this.createIpPie();
        });

        console.log(this.data);
      });
    },
    createTitle() {
      const myChart = echarts.init(document.getElementById('main'), null, {
        renderer: 'canvas',
        useDirtyRect: false
      });

      const option = {
        graphic: {
          elements: [
            {
              type: 'text',
              left: 'center',
              top: 'center',
              style: {
                text: '超级简单的权限管理系统',
                fontSize: 50,
                fontWeight: 'bold',
                lineDash: [0, 200],
                lineDashOffset: 0,
                fill: 'transparent',
                stroke: '#000',
                lineWidth: 1
              },
              keyframeAnimation: {
                duration: 3000,
                loop: false,
                keyframes: [
                  {
                    percent: 0.7,
                    style: {
                      fill: 'transparent',
                      lineDashOffset: 200,
                      lineDash: [200, 0]
                    }
                  },
                  {
                    // Stop for a while.
                    percent: 0.8,
                    style: {
                      fill: 'transparent'
                    }
                  },
                  {
                    percent: 1,
                    style: {
                      fill: 'black'
                    }
                  }
                ]
              }
            }
          ]
        }
      };

      if (option && typeof option === 'object') {
        myChart.setOption(option);
      }
      window.addEventListener('resize', myChart.resize);
    },
    createIpPie() {
      const dom = document.getElementById('chart-container');
      const myChart = echarts.init(dom, null, {
        renderer: 'canvas',
        useDirtyRect: false
      });


      let option;

      option = {
        title: {
          // text: 'Weather Statistics',
          text: '访问IP地址统计',
          subtext: '最近ちょっと落ち込む',
          left: 'center'
        },
        tooltip: {
          trigger: 'item',
          // formatter: '{b} : {c} ({d}%)'
          formatter: function ({data}) {
            let str = '';
            if(data.city!==null){
              str = '<table id="tool">';
              str += '<tr>';
              str += '<th>城市</th>';
              str += '<th>邮编</th>';
              str += '<th>访问次数</th>';
              str += '</tr>';
              for (let i = 0; i < data.city.length; i++) {
                if(data.city[i].city!==null){
                  str += '<tr>';
                  str += '<td>'+data.city[i].city+'</td>';
                  str += '<td>'+data.city[i].postalCode??""+'</td>';
                  str += '<td>'+data.city[i].cityCount+'</td>';
                  str += '</tr>';
                }else {
                  str += '<tr>';
                  str += '<td>不明城市</td>';
                  str += '<td></td>';
                  str += '<td>'+data.city[i].cityCount+'</td>';
                  str += '</tr>';
                }
              }
              str += '</table>';
            }else {
              str = `${data.name} : ${data.value}`;
            }
            return str;
          }
        },
        // legend: {
        //   bottom: 10,
        //   left: 'center',
        //   data: ['CityA', 'CityB', 'CityD', 'CityC', 'CityE']
        // },
        series: [
          {
            type: 'pie',
            radius: '65%',
            center: ['50%', '50%'],
            selectedMode: 'single',
            label : {
              show: true,
              position: 'inner',
              formatter: '{b} {c}次 ({d}%)',
              labelLine: {
                show: false
              }
            },
            data: this.data,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      };

      if (option && typeof option === 'object') {
        myChart.setOption(option);
      }
      console.log("000000000000");
      window.addEventListener('resize', myChart.resize);
    }

  },
  mounted() {
    this.createTitle();
  },
};
</script>

<style >
#tool {
  font-family: Arial, Helvetica, sans-serif;
  border-collapse: collapse;
  text-align: center;
  width: 100%;
}

#tool td, #tool th {
  border: 1px solid #ddd;
  padding: 8px;
}

#tool tr:nth-child(even){background-color: #f2f2f2;}

#tool tr:hover {background-color: #ddd;}

#tool th {
  padding-top: 12px;
  padding-bottom: 12px;
  text-align: left;
  background-color: #080531;
  color: white;
}
</style>

