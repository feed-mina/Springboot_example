var vueData = { 
	excrtDetail: {}
};
 
let vm;
var vueInit = () => {
	const app = Vue.createApp({
		data() {
			return vueData;
		},
		methods: {  
			fnDelete: (excrtSeq) => {
				$.confirm("정말 삭제하시겠습니까? 삭제한 자료는 다시 복구하지 못합니다.", () => {
					let param = {
						excrtSeq : excrtSeq,
					}
					$.sendAjax({
						url: "/experience/deleteExcrt.api",
						data : param,
						contentType: "application/json",
						success : () => {
							$.alert("삭제가 완료되었습니다.", () => {
								location.href="galleryManagement.html"
							});				
						}			
					})
				})
			},
			fnUpdt: (excrtSeq) => {
				location.href="galleryUpdt.html?excrtSeq=" + excrtSeq // EXCRT_00001014
			}
		}
	})
	vm = app.mount('#content');
} 

let  event = {
	init: () => {},
	getGalleryDetail: () => {
		let urlParams = new URL(location.href).searchParams;
		let excrtSeq = urlParams.get('excrtSeq');

		$.sendAjax({
			url: "/experience/selectExtfcDetail.api",
			data : {excrtSeq: excrtSeq},
			contentType: "application/json",
			success : (res) => {
				console.log("🚀 ~ res:", res);
				vm.excrtDetail = res.data
			}
		})
	}
};

$(document).ready(() => {
	vueInit(); ;
    event.getGalleryDetail();
    event.init(); 
    
});




