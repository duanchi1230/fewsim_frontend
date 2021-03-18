## 说明

需要移植App模块进现有的FEWSim系统。可以把App模块重命名成你需要的。

## 数据

整个App模块需要传入一个data对象，承载所有的数据。data的数据格式如下：
```json
{
  "timeRange": [2008, 2009, 2010, 2011, 2012],  // 数据time step的label，一般是年份。
  "scenarioNames": ['S1', 'S2', 'S3'],  // 所有scenario的名称（不能有重复，会当作主键使用）
  "susIndexNames": ['I1', 'I2'],  // 所有Sus Index的名称
  
  // chartBlocks包含每个折线图的具体信息
  "chartBlocks": {
    "scenarioName": "S1"  // 该折线图对应的scenario名称，是scenarioNames中的一项
    "susIndexName": "I1"  // 该折线图对应的sus index名称，是susIndexNames中的一项
    "scenarioIdx": 0,  // 该折线图对应的scenario名称在scenarioNames数组中的下标
    "susIndexIdx": 0,  // （下标，含义类比上一行）
    "series": [1.0, 1.1, 1.7, 2.3, 8.7]  // 折线数据，长度和timeRange对齐
  }
}
```

关于chartBlocks的顺序排布：sus index在外层，scenario在内层，即：
```
[{S0, I0}, {S1, I0}, {S2, I0}, {S0, I1}, {S1, I1}, {S2, I1},]
```
可参照index.js中数据的生成方法进行构建。

## 视图尺寸

有一些视图尺寸数据，需要根据你当前的系统布局和分辨率大小进行调整。

App.js, Line 12:
```javascript
const VIEW_SUSVIEW_WIDTH = 1200;  // 整个sus view的宽度
const VIEW_SUSVIEW_HEIGHT = 800;  // 整个sus view的高度
```

components/FlatView.js, Line 6:
```javascript
const VIEW_FLAT_VIEW_HEIGHT = 685;  // 平铺模式里主区域的高度，需要根据VIEW_SUSVIEW_HEIGHT的值做相应调整
const VIEW_CHART_HEIGHT = 180;  // 平铺模式里单个图表的高度
```

components/CompareView.js, Line 6:
```javascript
const VIEW_CHART_HEIGHT = 162;  // 比较模式里，上面的基准折线图的高度 
const VIEW_CHART_WIDTH = 368;  // 比较模式里，上面基准折线图的宽度
const VIEW_SIMILAR_RESULT_HEIGHT = 500;  // 比较模式里下半部分视图高度，需要根据VIEW_SUSVIEW_HEIGHT的值做相应调整
const VIEW_SIMILAR_RESULT_NUM_COL = 3;  // 比较模式里，下半部分ranking结果的列数
```

## 新的相似度度量

目前只写了一个time series间的欧式距离度量。你需要至少再添加一个Pearson相关度的度量。也可以把欧式距离的度量函数直接替换掉，即如下函数：

components/CompareView.js, Line 13:
```javascript
const computeDistance = (a, b) => {
    return numeric.norm2(
        numeric.sub(a.series, b.series)
    )
};
```