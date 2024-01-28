let vueData = {
    mberDetail: {},
    mberBlclst: {},
    urlParams: "",
}

let vm;

let vueInit = () => {
    const app = Vue.createApp({
        data() {
            return vueData;
        },
        methods: {
            // ,value = "{userSeq: USER_00000148, processAt: 'N'}"
            downloadFile: (fileSeq, fileDetailSn) => {
                fileDownload(fileSeq, fileDetailSn);
            },
            updateSttemntBlclst: (processAt) => {
                let param = {
                    userSeq: this.urlParams.get('userSeq'),
                    registDt: this.urlParams.get('registDt'),
                    processAt: processAt
                }
                $.sendAjax({
                    url: "/sysManage/updateSttemntBlclst.api",
                    data: param,
                    contentType: "application/json",
                    success: (res) => {
                        $.confirm("블랙리스트 업데이트가 정상적으로 되었습니다.", () => {
                            window.location.href = window.location.href;
                        })
                    }
                })
            },
        }
    })
    vm = app.mount("#content");
};

let event = {
    mberDetailOne: () => {
        let _this = this;
        console.log(this.urlParams);
        let param = {
            userSeq: urlParams.get('trgetUserSeq')
        }

        $.sendAjax({
            url: "/sysManage/selectMberOneDetail.api",
            data: param,
            contentType: "application/json",
            success: (res) => {
                vm.mberDetail = res.data;
                var befMonth = new Date(res.data.userStplat);

                befMonth.setFullYear(befMonth.getFullYear() + 5);
                var now = new Date(util.date.addDateDash(util.date.getToday()));
                var reStplat = (befMonth.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
                vm.mberDetail.reStplat = reStplat;
                if (res.data.psitnNm) {
                    let psitnNm1 = res.data.psitnNm.split('/');
                    vm.mberDetail.psitnNm1 = psitnNm1[0];
                    if (psitnNm1[1]) {
                        vm.mberDetail.psitnNm2 = psitnNm1[1];
                    }
                }
                vm.mberDetail.mbtlnum = res.data.mbtlnum ? util.formmater.phone(res.data.mbtlnum) : null;
            }
        })
    },
    selectMberBlclst: () => {
        let param = {
            userSeq: this.urlParams.get('userSeq'),
            registDt: this.urlParams.get('registDt'),
        }
        $.sendAjax({
            url: "/sysManage/selectMberBlclstDetail.api",
            data: param,
            contentType: "application/json",
            success: (res) => {
                console.log("🚀 ~ res:", res);
                vm.mberBlclst = res.data
            }
        })
    }
}

$(document).ready(() => {
    this.urlParams = new URL(location.href).searchParams;
    vueInit();
    event.mberDetailOne();
    event.selectMberBlclst();

})
