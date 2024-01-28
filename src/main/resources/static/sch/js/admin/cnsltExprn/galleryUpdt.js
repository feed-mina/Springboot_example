var vueData = {
	preview: "",
	// exprnKndCode: "",
	// exprnKndCodeList:[],
	// excrtPosbleList: [],
	// excrtPosbleAllList: [],
	// selectedExcrt: "",
	// sj:"",
	// exprnNm: "",
	
	excrtDetail: {}
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
			exprnKndCode (val) {
				console.log("🚀 ~ exprnKndCode ~ val:", val);
				// event.excrtPosbleList();

				vm.excrtPosbleList = vm.excrtPosbleAllList.filter(excrt => excrt.exprnKndCode === vm.exprnKndCode)
			}	
		},
		methods: {  
			fnAddIconClick:() => {
				$("#inputImgFile").click()
			},
			inputImgFileChange: async(e) => {
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
				
				const paramMap = vm.excrtDetail
				formData.append("paramMap", JSON.stringify(paramMap))

				$.sendAjax({
					url: "/experience/updateExcrt.api", 
					data: formData,
					enctype: "multipart/form-data",
					contentType:false,
					processData: false,
					cache: false,
					success: (res) => {
						$.alert("등록이 완료되었습니다. 목록으로 이동합니다.", () => {
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
	excrtDetail: () => {
		let urlParams = new URL(location.href).searchParams;
		let excrtSeq = urlParams.get('excrtSeq');

		$.sendAjax({
			url: "/experience/selectExtfcDetail.api",
			data : {excrtSeq: excrtSeq},
			contentType: "application/json",
			success: (res) => {
				console.log("🚀 ~ res:", res);
				vm.excrtDetail = res.data;
				vm.preview = `/cmmn/fileDownload.api?fileSeq=${res.data.imageFileSeq}`
			}
		})
	},

	init: () => { 
		event.excrtDetail();
	}	 
};


$(document).ready(() => {
	vueInit();
	util.tableSetting();
	event.init()
})



