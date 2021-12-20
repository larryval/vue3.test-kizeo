import {defineStore} from 'pinia'

export enum EFileType {
    FILE    = "file",
    FOLDER = "folder"
}

export enum ELocalStKey {
    isAppEditable    = "isAppEditable",
    treeList = "treeList"
}

export interface ITreeItem {
    name: string;
    type: string;
    id: number;
    mdp?: string,
    index?: number;
    parentID?: number;
    children?: Array<ITreeItem>;
}

interface IStAppState {
    treeList: Array<ITreeItem>;
    alertMsg: string
    editionStatus: boolean
}

//-----------------------------
//          Helpers
//-----------------------------
function giveMeReadableLogs(proxyObject: typeof Proxy | ITreeItem) {
    return JSON.parse(JSON.stringify(proxyObject))
}

function findItemNested(arr: any, itemId: any, nestingKey: any) {
    return arr.reduce((a: any, item: any) => {
        if (a) return a;
        if (item.id === itemId) return item;
        if (item[nestingKey]) return findItemNested(item[nestingKey], itemId, nestingKey)
    }, null)
}

//******************************
//          DEFINE-STORE
//******************************
export const useStApp = defineStore({
    id: 'StApp',
    state: (): IStAppState => ({
        alertMsg: "",
        editionStatus: true,
        treeList: [{
            name: "ROOT",
            type: "folder",
            id: 10,
            children: [
            {
                name: "Dossier 1",
                type: "folder",
                id: 0,
                children: [
                    {
                        name: "Dossier 2",
                        type: "folder",
                        id: 1,
                        children: [
                            {
                                name: "Dossier 3",
                                type: "folder",
                                id: 2,
                                children: [{
                                    name: "Mot de passe 1",
                                    mdp: "toto",
                                    type: "file",
                                    id: 3,
                                    children: [],
                                },
                                    {
                                        name: "Mot de passe 2",
                                        mdp: "titi",
                                        type: "file",
                                        id: 3,
                                        children: [],
                                    }],
                            },
                            {
                                name: "Mot de passe 3",
                                mdp:"tata",
                                type: "file",
                                id: 4,
                                children: [],
                            },
                        ],
                    },
                    {
                        name: "Dossier 4",
                        type: "folder",
                        id: 5,
                        children: [],
                    },
                ],
            },
            {
                name: "Dossier 5",
                type: "folder",
                id: 6,
                children: [
                    {
                        name: "Mot de passe 5",
                        mdp:"tyty",
                        type: "file",
                        id: 7,
                        children: [],
                    },
                    {
                        name: "Mot de passe 6",
                        mdp:"tutu",
                        type: "file",
                        id: 8,
                        children: [],
                    }
                ],
            }
        ]}]
    }),

    //******************************
    //          GETTERS
    //******************************
    getters: {
        getEditionStatus(state) {
            if (localStorage.getItem(ELocalStKey.isAppEditable)) {
                return JSON.parse(localStorage.getItem(ELocalStKey.isAppEditable) || "{}");
            } else {
                return state.editionStatus;
            }

        },
        // TODO : ça bougue quand drop folder dans folder enfant :( --- method
        canIDropThis: (state) => {
            return (itemSelectedID: number, itemTargetedID: number) => {
                return "maybe"
            }
        },
    },
    //******************************
    //          ACTIONS
    //******************************
    actions: {
        onClear(){
            localStorage.clear();
            window.location.reload();
        },
        checkTreeChanges() {
            if (localStorage.getItem(ELocalStKey.treeList)) {
                return !(JSON.stringify(this.treeList) == localStorage.getItem(ELocalStKey.treeList));
            } else {
                return false;
            }
        },
        setAlertMsg(msg: string) {
            this.alertMsg = msg;
        },
        setEditionStatus(isAppEditable: boolean) {
            this.editionStatus = isAppEditable;
            localStorage.setItem(ELocalStKey.isAppEditable, JSON.stringify(isAppEditable));
            },

        loadTreeListFromLocalStorage() {
            if (localStorage.getItem(ELocalStKey.treeList)) {
                this.treeList = JSON.parse(localStorage.getItem(ELocalStKey.treeList) || "{}");
            }
        },
        changeTree(itemSelectedID: number, itemTargetedID: number) {
            this.alertMsg = "";

            let itemSelected: ITreeItem = findItemNested(this.treeList, +itemSelectedID, "children");
            let itemTargeted: ITreeItem = findItemNested(this.treeList, +itemTargetedID, "children");

            //-- on ne peut pas déplacer un truc dans un fichier
            if (itemTargeted.type === EFileType.FILE) {
                this.alertMsg = "les fichiers n'accueillent pas :(";
                this.setEditionStatus(true);
                return;
            }

            //-- on ne fait rien si on drop sur-place
            if (itemSelected.id == itemTargeted.id) {
                this.setEditionStatus(true);
                return;
            }

            let itemSelectedParent = findItemNested(this.treeList, itemSelected.parentID, "children");
            if (!itemTargeted.children) itemTargeted.children = [];

            //-- set le nouvel parentID de l'éléménet droppé + push élément
            itemSelected.parentID = itemTargeted.id;
            itemTargeted.children?.push(itemSelected);

            // enlève l'élément droppé depuis son parent & re-calcule les bons index
            itemSelectedParent.children.splice(itemSelected.index, 1);
            itemSelectedParent.children.map((el: any, index: number) => {
                el.index = index;
            })

            //-- set du bon index de l'élément droppé
            let newIndex = itemTargeted.children?.length;
            if (newIndex) itemSelected.index = newIndex - 1

            //-- set localStorage :
            localStorage.setItem("treeList", JSON.stringify(this.treeList));
            this.setEditionStatus(true);
        },
    },
})