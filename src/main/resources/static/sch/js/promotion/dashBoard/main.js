let event = {
	init: () => { 
	}, 
	mainQna : () => {
		$.sendAjax({
				url: "/main/selectMainQna.api",
				data:{},
				contentType: 'application/json',
				success: function (res) {
					console.log(res.data)
					console.log(res.data.length)
					let totalCount = res.data.length;
					let arr = []
					let swiper= {
						sj : [],
						cn : [],
						date : [],
						ans:[]
					}
					for(let i=0; i<totalCount; i++){
						console.log(res.data[i]) 
						swiper.sj.push(res.data[i].bbsSj)
						swiper.cn.push(res.data[i].bbsCn)
						swiper.date.push(res.data[i].registDt) 
						arr.push(res.data[i])
					}
					console.log(swiper.sj)
					console.log(swiper.cn)
					console.log(arr)
				},
		});
	}, 
			
}

$(document).ready( () => {
	event.mainQna();
});

document.addEventListener("DOMContentLoaded", function () {
	const swiperContainer = document.querySelectorAll(".carousel slide")[1];
	//document.querySelectorAll(".swiper-container")는 HTML 문서에서 모든 swiper-container 클래스를 가진 요소들을 선택하고, 그중에서 두번째에 해당(인덱스[1])하는 부분을 선택
	console.log(swiperContainer.childNodes);

	const swiperWrapper = swiperContainer.childNodes[1];
	//너비를 계산하기 위해 가져옴
	//swiperContainer.childNodes: 이 속성은 swiperContainer 요소의 모든 자식 노드를 포함하는 NodeList를 반환(텍스트 노드와 주석 노드도 포함)
	const nextButton = document.querySelector(".carousel-control-prev");
	const prevButton = document.querySelector(".carousel-control-next");
	const recommened = document.querySelector(".recommend_container");
	const contentSets = recommened.children.length;
	//이거는 슬라이드로 쓰여질 세트의 갯수

	const contentSetWidth = swiperWrapper.clientWidth; // 각 슬라이드의 너비

	let currentSet = 0;
	//초기값을 0으로 정함

	// 다음 슬라이드로 이동하는 함수
	function nextSet(e) {
		if (currentSet < contentSets - 1) {
			currentSet++;
			recommened.style.transform = `translateX(-${
				contentSetWidth * currentSet
			}px)`;
		}
	}

	// 이전 슬라이드로 이동하는 함수
	function prevSet() {
		if (currentSet > 0) {
			currentSet--;
			recommened.style.transform = `translateX(-${
				contentSetWidth * currentSet
			}px)`;
		}
	}

	// 네비게이션 버튼에 이벤트 리스너 추가
	prevButton.addEventListener("click", prevSet);
	nextButton.addEventListener("click", nextSet);
});

