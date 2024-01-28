var vueData = {
	preview: "",
	exprnKndCode: "",
	exprnKndCodeList:[],
	excrtPosbleList: [],
	excrtPosbleAllList: [],
	selectedExcrt: "",
	sj:""
};

let dataPerPage = 10;
let pagePerBar = 10;
let pageCount = 10;

var vm;
var vueInit = () => {
	const app = Vue.createApp({
		data() {
			return vueData;
		},
		watch: {
			exprnKndCode(val) {
				event.excrtPosbleList();
			}	
		},
		methods: {  
			fnAddIconClick:() => {
				$("#inputImgFile").click()
			},
			inputImgFileChange: async (e) => {
				// const compressedFile = await util.getCompressed(e.target.files[0]);
				const base64 = await util.blobToBase64(e.target.files[0]);
				vm.preview = base64
			},
			fnCancel: () => {
				$.confirm("변경사항을 취소 하시겠습니까?", () => {
					$.alert("목록으로 이동합니다.", () => {
						location.href = "galleryManagement.html";
					})
				})
			},
			fnSave: () => {
				const formData = new FormData();
				const file = $("#inputImgFile")[0].files[0]
				formData.append("uploadFile", file);
				
				const paramMap ={
					exprnKndCode: vm.exprnKndCode,
					exprnDt: vm.selectedExcrt.exprnDt,
					exprnTmeNm: vm.selectedExcrt.exprnTmeNm,
					sj: vm.sj
				}
				formData.append("paramMap", JSON.stringify(paramMap))
				$.sendAjax({
					url: "/experience/insertExcrt.api", 
					data: formData,
					enctype: "multipart/form-data",
					contentType:false,
					processData: false,
					cache: false,
					success: (res) => {
						$.alert("저장이 완료되었습니다. 체험인증 목록으로 이동합니다", () => {
							location.href = "galleryManagement.html";
						});
					}
				})
			}   


		} 
	})
	vm = app.mount('#content');
}
let event = {
	exprnKndCodeList: () => {
		$.sendAjax({
			url: "/cmmn/selectCmmnCode.api",
			data: {
				upperCmmnCode: "EXPRN_KND_CODE"
			},
			contentType: "application/json",
			success: (res) => {
				console.log("🚀 ~ res:", res);
				vm.exprnKndCodeList = res.data
				vm.exprnKndCode = vm.exprnKndCodeList[0].cmmnCode

				event.excrtPosbleList();
			}
		})
	},
	excrtPosbleList: () => {
		$.sendAjax({
			url: "/experience/excrtPosbleList.api", 
			data: {
				exprnKndCode: vm.exprnKndCode
			},
			contentType: "application/json",
			success: (res) => {
				vm.excrtPosbleList = res.data
				vm.excrtPosbleList = vm.excrtPosbleList.map(excrt => ({
					...excrt,
					exprnTmeNm: excrt.exprnNm + " " + util.date.addDateDash(excrt.exprnDt) + " / " + excrt.exprnSn + "회차 " +  util.date.addDateColon(excrt.exprnBeginTime) + " ~ " + util.date.addDateColon(excrt.exprnEndTime)
				}))
				vm.selectedExcrt = vm.excrtPosbleList[0]
			}
		})
	},
	init: () => { 
		event.exprnKndCodeList();
	}	 
};


$(document).ready(() => {
	vueInit();
	util.tableSetting();
	event.init()
})



