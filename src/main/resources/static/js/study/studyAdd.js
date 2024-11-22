 let lastCheckedRadio = null;

    function showPopup(event) {
        event.preventDefault();
        
        // 팝업 창의 크기 설정
        var popupWidth = 350;
        var popupHeight = 250;
        
        // 화면의 중앙 좌표 계산
        var left = (window.screen.width / 2) - (popupWidth / 2);
        var top = (window.screen.height / 2) - (popupHeight / 2);
        
        // 팝업 창 열기
        var popup = window.open('/createRoom', 'popup', 
            `width=${popupWidth},height=${popupHeight},left=${left},top=${top}`);
        
        popup.onunload = function() {
            if (popup.closed) {
                alert("채팅방 생성 완료");
                var roomname = popup.document.getElementById('roomname').value;
                document.getElementById('roomname').value = roomname;
            }
        }
    }

    function previewImages(event) {
        var preview = document.getElementById('image-preview');
        preview.innerHTML = '';

        var files = event.target.files;

        for (var i = 0; i < files.length; i++) {
            var file = files[i];
            var reader = new FileReader();

            reader.onload = function(e) {
                var img = document.createElement('img');
                img.src = e.target.result;
                img.onclick = function() {
                    openModal(this.src);
                };
                preview.appendChild(img);
            }

            reader.readAsDataURL(file);
        }

        document.getElementById('additional-fields').style.display = 'block';
    }

    function openModal(src) {
        var modal = document.getElementById('imageModal');
        var modalImg = document.getElementById("modalImage");

        // 이미지 크기 설정
        modalImg.style.maxWidth = "50vw";  
        modalImg.style.maxHeight = "80vh"; 
        modalImg.src = src;

        // 모달을 화면 중앙에 표시
        modal.style.display = "flex";
        modal.style.alignItems = "center";
        modal.style.justifyContent = "center";
    }

function slideDown(element, duration = 500) {
    element.style.display = 'block';
    const height = element.scrollHeight;
    element.style.overflow = 'hidden';
    element.style.maxHeight = '0';
    element.style.transition = `max-height ${duration}ms ease-out`;

    requestAnimationFrame(() => {
        element.style.maxHeight = `${height}px`;
    });
 
    setTimeout(() => {
        element.style.maxHeight = '';
        element.style.overflow = '';
        element.style.transition = '';
    }, duration);
}

function slideUp(element, duration = 500) {
    const height = element.scrollHeight;
    element.style.overflow = 'hidden';
    element.style.maxHeight = `${height}px`;
    element.style.transition = `max-height ${duration}ms ease-out`;

    requestAnimationFrame(() => {
        element.style.maxHeight = '0';
    });

    setTimeout(() => {
        element.style.display = 'none';
        element.style.overflow = '';
        element.style.transition = '';
    }, duration);
}

function toggleProblemDetails(event) {
    const details = document.getElementById('problem-details');
    const radioButton = event.target;

    if (radioButton.checked) {
        slideDown(details);
        lastCheckedRadio = radioButton;
    } else {
        slideUp(details);
        radioButton.checked = false;
        lastCheckedRadio = null;
    }
}


window.onload = function() {
    var today = new Date().toISOString().split('T')[0];
    var startdate = document.getElementById("startdatetest");
    var enddate = document.getElementById("enddatetest");

    startdate.setAttribute('min', today);
    enddate.setAttribute('min', today);

    /* 모달함수 */
    var modal = document.getElementById('imageModal');
    var span = document.getElementsByClassName("close")[0];
    span.onclick = function() {
        modal.style.display = "none";
    }
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    startdate.addEventListener('change', function() {
        var selectedDate = new Date(startdate.value);
        var endDate = new Date(selectedDate);
        endDate.setDate(selectedDate.getDate() + 7);

        var formattedEndDate = endDate.toISOString().split('T')[0];

        enddate.setAttribute('min', selectedDate.toISOString().split('T')[0]);
        enddate.value = formattedEndDate;

        if (enddate.value < selectedDate.toISOString().split('T')[0]) {
            enddate.value = selectedDate.toISOString().split('T')[0];
        }
    });

        /* 해시태그 복붙 */
      const hashtagsInput = document.getElementById("hashtags");
	  const hashtagsContainer = document.getElementById("hashtags-container");
	  const hiddenHashtagsInput = document.getElementById("tag");

	let hashtags = [];

function addHashtag(tag) {
    tag = tag.replace(/[\[\],]/g, '').trim(); // 쉼표(,)와 대괄호([]) 제거
    if (tag && !hashtags.includes("#" + tag)) { // 중복 체크를 추가함
        const span = document.createElement("span");
        span.innerText = "#" + tag;
        span.classList.add("hashtag");

        const removeButton = document.createElement("button");
        removeButton.innerText = "x";
        removeButton.classList.add("remove-button");
        removeButton.addEventListener("click", () => {
            hashtagsContainer.removeChild(span);
            hashtags = hashtags.filter((hashtag) => hashtag !== "#" + tag);
            hiddenHashtagsInput.value = hashtags.join(",");
        });

        span.appendChild(removeButton);
        hashtagsContainer.appendChild(span);
        hashtags.push("#" + tag);
        hiddenHashtagsInput.value = hashtags.join(",");
    } else {
        console.log("이미 추가된 태그입니다."); // 이미 추가된 경우 콘솔에 로그 출력
    }
}

hashtagsInput.addEventListener("keydown", (event) => {
    if (event.key === 'Enter') {
        event.preventDefault();
        const tags = hashtagsInput.value.split(','); // 쉼표(,)로 분할
        tags.forEach(tag => {
            if (tag.trim()) {
                addHashtag(tag.trim());
            }
        });
        hashtagsInput.value = "";
    }
});
        document.getElementById('problem').addEventListener('click', toggleProblemDetails);
        
        document.querySelectorAll('input[type="text"], input[type="date"]').forEach(input => {
            input.addEventListener("keydown", (event) => {
                if (event.key === 'Enter') {
                    event.preventDefault();
                }
            });
        });
    }
    
document.getElementById("cancelBtn").addEventListener("click", function() {
    if (confirm("글 작성을 취소하시겠습니까?")) {
        location.href = "/studylist";
    }
});