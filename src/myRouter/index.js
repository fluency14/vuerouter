class HistoryRouter{
  constructor(){
    // 要监听的路由
    this.current = null;
  }
}
class vueRouter{
  constructor(options){ // options 就是路由文件中的配置详细信息规则routes
    this.mode = options.mode || 'hash'; // 配置里传了mode模式，就用mode，否则用hash
    this.routes = options.routes || []; // 配置里传了routes，就用routes，否则为空数组
    this.routesMap = this.createMap(this.routes);
    this.history = new HistoryRouter; // 实例化上面的类
    this.init(); // 初始
    console.log(this.mode)
  }
  init(){
    if(this.mode == 'hash'){
      //自动加 # ，如果hash存在，就返回空字符串，不存在的话就加上/
      location.hash?'':location.hash='/';
      // 监听页面加载完成
      window.addEventListener('load',()=>{
        // 将当前hash赋值给current,去掉第一个字符#
        this.history.current = location.hash.slice(1);
      })
      // 监听hash改变
      window.addEventListener('hashchange',()=>{
        // 将当前hash赋值给current,去掉第一个字符#
        this.history.current = location.hash.slice(1);
        console.log('路由改变了')
      })
    }else if(this.mode == 'history'){
      //使用history
      location.pathname ? "" : location.pathname = "/";
      window.addEventListener("load", () => {
        this.history.current = location.pathname;
      })
      window.addEventListener("popstate", () => {
        this.history.current = location.pathname;
      })
    }
  }
  createMap(routes){
    // 将routes数组关系变为键值对,current对象,生成路由映射表
    return routes.reduce((memo,current)=>{
      memo[current.path] = current.component;
      return memo;
    }, {})
  }
}
vueRouter.install=function(vue){
  // 注意判断插件是否已经注册,防止重复注册
  if(vueRouter.install.installed)return
  vueRouter.install.installed = true;
  vue.mixin({
    beforeCreate(){
      // main.js 中的配置选项
      if(this.$options && this.$options.router){
        // 把当前实例挂载到root上
        this._root = this;
        this._router = this.$options.router;
        // 监听 this 当前的 历史的
        vue.util.defineReactive(this,'current',this._router.history)
      }else{
        // 当前没有 root 就向上查找一级
        this._root = this.$parent._root;
      }
      // 将_router赋给$router(这样操作可以防止擅自修改this.$router,也就是将$router设置为只读)
      Object.defineProperty(this,'$router',{
        get(){
          return this._root._router;
        }
      })
      Object.defineProperty(this, "$route", {
        get() {
          return {
            current: this._root._router.history.current
          }
        }
      })
    }
  })
  // 定义组件<router-view></router-view>
  vue.component('router-view',{
    render(h){
      let current = this._self._root._router.history.current;
      // console.log(current)
      let routerMap = this._self._root._router.routesMap;
      // console.log(this)
      return h(routerMap[current]);
    }
  })
  // 定义组件<router-link></router-link>
  vue.component('router-link',{
    props: {
      to: String,
      tag:String
    },
    render(h) {
      let mode = this._self.$router.mode;
      let tag = this.tag || 'a';
      let routerHistory = this._self.$router.history;
      return h(tag, {
        attrs: tag === 'a' ? {href: mode === 'hash' ? '#' + this.to : this.to,} : {},
        on: {
          click: (e) => {
            if (this.to === routerHistory.current) {
              e.preventDefault();
              return;
            }
            console.log(this)
            routerHistory.current = this.to;
            switch (mode) {
              case 'hash':
                if (tag === 'a') return;
                location.hash = this.to;
              break;
              case 'history':
                history.pushState({
                  path: this.to
                }, null, this.to);
              break;
              default:
            }
            e.preventDefault();
          }
        },
        style: {
          cursor: 'pointer'
        }
      }, this.$slots.default)
    }
  })
}
export default vueRouter