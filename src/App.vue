<template>

  <div class="container">
    <div class="row">

      <div class="col">
        <div class="alertMsg" v-if="StApp.alertMsg!=''">
          <h6 class="m-0" >{{StApp.alertMsg}}</h6>
        </div>

        <div class="col mt-5">
          <CTreeView :node="StApp.treeList">
          </CTreeView>
        </div>

        <hr>
        <div class="btn btn-info mb-5" @click="onClear">clear LocalStorage & reload</div>

        <button class="d-none" @click="dragFalse">set dragg to false</button>
        <button class="d-none" @click="dragTrue">set dragg to true</button>

      </div>
    </div>
  </div>

</template>

<script lang="ts">
import {defineComponent, onMounted} from 'vue';
import CTreeView from '@/components/CTreeView.vue';
import {useStApp} from "@/store/StApp";

export default defineComponent({
  name: 'VHome',
  components: {CTreeView},
  setup() {
    const StApp = useStApp();

    onMounted(() => {
      StApp.loadTreeListFromLocalStorage();

      if(localStorage.getItem('isAppEditable')){
        StApp.setEditionStatus(JSON.parse(localStorage.getItem('isAppEditable') || "{}"))
      }
    });


    const onClear = ()=>{
      StApp.onClear();
    }

    // for dev
    const dragFalse = ()=>{
      StApp.setEditionStatus(false);
    }
    const dragTrue = ()=>{
      StApp.setEditionStatus(true);
    }

    return {StApp,onClear,dragFalse,dragTrue}
  }

})
</script>

<style lang="scss" scoped>
.disappear{
  display: none;
}
.alertMsg{
  position: fixed;
  padding: 10px;
  top:5px;
  width: 50%;
  background-color: $color-red;
  border-radius: 5px;
}
</style>
