<template>
  <div class="goods">
    <div class="menu-wrapper" ref="menuWrapper">
      <ul>
        <li class="menu-item" v-for="(item,index) in goods" :class="{'current':currentIndex === index}" @click="selectMenu(index,$event)">
          <span class="text" border-1px>
            <span class="icon" v-show="item.type > 0" :class="classMap[item.type]"></span>
            {{item.name}}
          </span>
        </li>
      </ul>
    </div>
    <div class="foods-wrapper" ref="foodsWrapper">
      <ul>
        <li class="food-list food-list-hook" v-for="item in goods">
          <h1 class="title">{{item.name}}</h1>
          <ul>
            <li class="food-item border-1px" v-for="food in item.foods">
              <div class="icon">
                <img :src="food.icon" width="57" height="57" alt="">
              </div>
              <div class="content">
                <h2 class="name">{{food.name}}</h2>
                <p class="desc">{{food.description}}</p>
                <div class="extra">
                  <span class="count">月销{{food.sellCount}}</span>
                  <span>好评率{{food.rating}}%</span>
                </div>
                <div class="price">
                  <span class="now">￥{{food.price}}</span>
                  <span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
                </div>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <shopcart :delivery-price="seller.deliveryPrice" :min-price="seller.minPrice"></shopcart>
  </div>
</template>

<script>
import BScroll from "better-scroll";
import shopcart from "../shopcart/shopcart";

const ERR_OK = 0;

export default {
  props: {
    seller: {
      type: Object
    }
  },
  data() {
    return {
      goods: [],
      listHeight: [],
      scrollY: 0
    };
  },
  computed: {
    //  主要是为了获取每一个foods内部块的高度
    currentIndex() {
      for (let i = 0, l = this.listHeight.length; i < l; i++) {
        let height1 = this.listHeight[i]; // 当前menu子块区域的高度
        let height2 = this.listHeight[i + 1]; // 当前menu子块区域的高度
        // 滚动到底部的时候,height2为undefined,需要考虑这种情况
        // 需要确定是在两个menu子块的高度区间
        if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
          return i; // 返回这个menu子块的索引
        }
      }
      return 0;
    }
  },
  created() {
    this.classMap = ["decrease", "discount", "special", "invoice", "guarantee"];

    this.$http
      .get("/api/goods")
      .then(response => {
        response = response.body; // 返回object
        if (response.errno === ERR_OK) {
          this.goods = response.data;
          // console.log(this.goods);
          // 保证dom元素已经渲染
          this.$nextTick(() => {
            // 发生更新后要执行的事件
            this._initScroll();
            this._calculateHeight();
          });
        }
      })
      .catch(error => {
        console.log("请求失败!!!" + error);
      });
  },
  methods: {
    // 点击
    selectMenu(index, event) {
      // 去掉自带的click事件点击，即pc端直接返回
      // if (!event._constructed) {
      //   return;
      // }
      let foodList = this.$refs.foodsWrapper.querySelectorAll(
        ".food-list-hook"
      );
      let el = foodList[index]; // 获得当前监听元素的高度
      this.foodsScroll.scrollToElement(el, 300); //类似jump to的功能,通过这个方法,跳转到指定的dom
    },
    // 滚动
    _initScroll() {
      // let meunScroll = document.querySelector(".menu-wrapper");
      // let MS = new BScroll(meunScroll, {
      //   click: true // 结合BScroll的接口使用,是否将click事件传递,默认被拦截了
      // });
      // let foodsScroll = document.querySelector(".foods-wrapper");
      // let FS = new BScroll(foodsScroll, {
      //   probeType: 3 // 结合BScroll的接口使用,3实时派发scroll事件，探针的作用
      // });

      this.meunScroll = new BScroll(this.$refs.menuWrapper, {
        click: true
      });

      this.foodsScroll = new BScroll(this.$refs.foodsWrapper, {
        click: true,
        probeType: 3
      });

      // 结合BScroll的接口使用,监听scroll事件(实时派发的),并获取鼠标坐标，当滚动时能实时暴露出scroll
      this.foodsScroll.on("scroll", pos => {
        this.scrollY = Math.abs(Math.round(pos.y));
      });
    },
    // 计算高度
    // 通过 方法 计算foods内部每一个块的高度,组成一个数组listHeight。
    // 每个li 定义一个类food-list-hook  通过获取该类 来计算 每一块的高度 存到数组listHeight里
    _calculateHeight() {
      // let foodList = document.querySelector(".food-list-hook");
      let foodList = this.$refs.foodsWrapper.getElementsByClassName(
        "food-list-hook"
      );
      let height = 0;
      this.listHeight.push(height); // 初始化第一个高度为0
      for (let i = 0; i < foodList.length; i++) {
        let item = foodList[i]; // 初始化第一个高度为0
        height += item.clientHeight; // 主要是为了获取每一个foods内部块的高度
        this.listHeight.push(height);
      }
    }
  },
  components: {
    shopcart
  }
};
</script>

<style lang="scss" scoped>
@import "../../common/style/mixin.scss";

.goods {
  display: flex;
  position: absolute;
  top: 174px;
  bottom: 46px;
  width: 100%;
  overflow: hidden;
  .menu-wrapper {
    flex: 0 0 80px;
    width: 80px;
    background: #f3f5f7;
    .menu-item {
      display: table;
      width: 56px;
      height: 54px;
      line-height: 14px;
      padding: 0 12px;
      &.current {
        position: relative;
        margin-top: -1px;
        z-index: 10;
        background: #fff;
        font-weight: 700;
        .text {
          @include border-none();
        }
      }
      .icon {
        display: inline-block;
        vertical-align: top;
        width: 12px;
        height: 12px;
        margin-right: 2px;
        background-size: 12px 12px;
        background-repeat: no-repeat;
        &.decrease {
          @include bg-image("decrease_3");
        }
        &.discount {
          @include bg-image("discount_3");
        }
        &.guarantee {
          @include bg-image("guarantee_3");
        }
        &.invoice {
          @include bg-image("invoice_3");
        }
        &.special {
          @include bg-image("special_3");
        }
      }
      .text {
        display: table-cell;
        width: 56px;
        vertical-align: middle;
        font-size: 12px;
        @include border-1px(rgba(7,17,27,0.1));
      }
    }
  }
  .foods-wrapper {
    flex: 1;
    .title {
      padding-left: 14px;
      height: 26px;
      line-height: 26px;
      border-left: 2px solid #d9dde1;
      font-size: 12px;
      color: rgb(147, 153, 159);
      background: #f3f5f7;
    }
    .food-item {
      display: flex;
      margin: 18px;
      padding-bottom: 18px;
      @include border-1px(rgba(7,17,27,0.1));
      &:last-child {
        @include border-none();
        margin-bottom: 0;
      }
      .icon {
        flex: 0 0 57px;
        margin-right: 10px;
      }
      .content {
        flex: 1;
        .name {
          margin: 2px 0 8px 0;
          height: 14px;
          line-height: 14px;
          font-size: 14px;
          color: rgb(7, 17, 27);
        }
        .desc,
        .extra {
          line-height: 10px;
          font-size: 10px;
          color: rgb(147, 153, 159);
        }
        .desc {
          line-height: 12px;
          margin-bottom: 8px;
        }
        .extra {
          line-height: 10px;
          .count {
            margin-right: 12px;
          }
        }
        .price {
          font-weight: 700;
          line-height: 24px;
          .now {
            margin-right: 8px;
            font-size: 14px;
            color: rgb(240, 20, 20);
          }
          .old {
            text-decoration: line-through;
            font-size: 10px;
            color: rgb(147, 153, 159);
          }
        }
      }
    }
  }
}
</style>
