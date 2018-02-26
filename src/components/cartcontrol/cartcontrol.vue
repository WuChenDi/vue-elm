<template>
  <div class="cartcontrol">
    <!-- <div class="cart-decrease" v-show="food.count>0" @click="decreaseCart" transition="move">
      <span class="inner icon-remove_circle_outline"></span>
    </div> -->
    <transition name="move">
      <div class="cart-decrease" v-show="food.count>0" @click="decreaseCart">
        <span class="inner icon-remove_circle_outline"></span>
      </div>
    </transition>
    <div class="cart-count" v-show="food.count>0">{{food.count}}</div>
    <div class="cart-add icon-add_circle" @click="addCart"></div>
  </div>
</template>

<script>
import Vue from "vue";

export default {
  props: {
    food: {
      type: Object
    }
  },
  methods: {
    // 点击增加
    addCart(event) {
      //console.log(123);
      // 去掉自带的click事件点击，即pc端直接返回
      // if (!event._constructed) {
      //   return;
      // }
      if (!this.food.count) {
        Vue.set(this.food, "count", 1);
      } else {
        this.food.count++;
      }
      // 当点击 添加数量时  通过 $emit 属性 提交一个名为 add 给父组件
      // 子组件通过 $emit触发 add事件 ，将参数传递给父组件
      this.$emit('add',event.target);
    },
    // 点击减少
    decreaseCart(event) {
      // 去掉自带的click事件点击，即pc端直接返回
      // if (!event._constructed) {
      //   return;
      // }
      if (this.food.count) {
        this.food.count--;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.cartcontrol {
  font-size: 0;
  .cart-decrease {
    display: inline-block;
    padding: 6px;
    transition: all 0.4s linear;
    .inner {
      line-height: 24px;
      font-size: 24px;
      color: rgb(0, 160, 220);
      transition: all 0.4s linear;
    }
    &.move-enter-active,
    &.move-leave-active {
      transform: translate3d(0, 0, 0);
      .inner {
        display: inline-block;
        transform: rotate(0);
      }
    }
    &.move-enter,
    &.move-leave-active {
      opacity: 0;
      transform: translate3d(24px, 0, 0);
      .inner {
        transform: rotate(180deg);
      }
    }
  }
  .cart-count {
    display: inline-block;
    vertical-align: top;
    width: 12px;
    padding-top: 6px;
    line-height: 24px;
    text-align: center;
    font-size: 10px;
    color: rgb(147, 153, 159);
  }
  .cart-add {
    display: inline-block;
    padding: 6px;
    line-height: 24px;
    font-size: 24px;
    color: rgb(0, 160, 220);
  }
}
</style>
