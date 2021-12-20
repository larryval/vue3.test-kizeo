<template>
    <ul class="">
      <li v-for="item in node" :key="item.name">

        <div class="drop-zone my-2"
             @drop="onDrop($event, item.id)"
             @dragenter.prevent
             @dragover.prevent>

          <div v-if="item.type == 'folder'" class="folderUI m-2"
               draggable="true"
               @dragstart="startDrag($event, item)">
            <p class="m-0">
              <span class="badge bg-dark me-2">FOLDER</span> {{ item.name }}
            </p>
          </div>

          <div v-if="item.type == 'file'" class="fileUI m-2"
               draggable="true"
               @dragstart="startDrag($event, item)">
            <p class="m-0">
              <span class="badge bg-secondary me-2">file</span>{{ item.name }}
            </p>
            <p class="m-0  mdp">{{item.mdp}}</p>
          </div>

        </div>

        <CTreeView :node="item.children" v-if="item.children" :depth="depth + 1"/>

      </li>
    </ul>
</template>

<script lang="ts">

import {defineComponent} from 'vue';
import {useStApp ,ITreeItem } from "@/store/StApp";

export default defineComponent({
  name: "CTreeView",
    props: {
    node:Array,
    depth:{
      type:Number,
      default:0
    }
  },
  setup(props) {

    const StApp = useStApp();

   //-- set default parentID & index
    // props.node?.map((el:ITreeItem)=>{
    props.node?.map((el:any)=>{
        if(el.children){
            el.children.map((elChildren:ITreeItem,index:number)=>{
              elChildren.parentID = el.id;
              elChildren.index = index;
            })
        }
    })

    const startDrag = (event:any,item:ITreeItem) => {
      if(StApp.checkTreeChanges()){
        StApp.loadTreeListFromLocalStorage();
        StApp.setAlertMsg("l'Application à été modifiée ! mise à jour instantanée");
        return;
      };

      if(StApp.getEditionStatus){
        StApp.setEditionStatus(false);
        StApp.setAlertMsg("");
        event.dataTransfer.effectAllowed = "move";
        event.dataTransfer.dropEffect = "move";
        event.dataTransfer.setData("itemID", item.id)
      }else{
        event.preventDefault();
        StApp.setAlertMsg("Edition de l'application en cours...patience.");
      }
    }

    const onDrop = (event:any, itemTargetedID:number) => {
      let itemSelectedID = event.dataTransfer.getData("itemID");

      //-- on ne fait rien si un dossier parent veut aller chez son fils
      // TODO : ça bougue quand drop folder dans folder enfant :(

      StApp.changeTree(itemSelectedID , itemTargetedID);
    }

    return {startDrag, onDrop}
  }
});
</script>

<style lang="scss" scoped>
  .node{
    text-align: left;
  }
  .drop-zone {
    font-size: 0.9rem;
    display: inline-block;
    min-width: 300px;
    background-color: $color-grey-light;
    padding: 2px;
    border-radius: 5px;
  }
  .folderUI{
    background-color: lightblue;
    padding: 5px;
    border-radius: 5px;
    border: $color-grey-darker 1px solid;
  }

  .fileUI{
    padding: 2px;
    background-color: $color-grey-lighter;
    border: $color-grey-dark 1px solid;
    border-radius: 5px;
  }

  .mdp {
    padding-right: 7px;
    text-align: right;
    font-weight: bold;
  }

</style>