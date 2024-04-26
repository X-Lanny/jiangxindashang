//2. 完成留言功能，输入留言提交到留言板。ok
//3. 留言板交互，留言卡片可以拖动但不离开留言框。
let backgroundColors = ['#D7DBEB','#FDFBE9','#F1FFF0','#EBD7D7'];
const PAGE ={
    data: {
        cardList: [],
        
        cardItem: null,
        backgroundColors: backgroundColors,
        containerPadding: 20,
        zIndex : 0,
        cardWidth: 320,
        cardHeight: 158,
        isLock: true,
        pageX: null,
        pageY: null,
        itemoffsetTop: null,
        itemoffsetLeft: null,
        dataIndex : 0,
    },
    init:function(){
        this.getData();
        this.bind(); 
        console.log(PAGE.data.cardList);
    },
    bind:function(){
        let messageInput = document.getElementById('message-input');
        messageInput.addEventListener('keyup',this.addCardEnter);
        let messageBtn = document.getElementById('message-btn');
        messageBtn.addEventListener('click',PAGE.addCardButton);

        let messageBoard = document.getElementById('message-board');
        this.onEventListener(messageBoard, 'mousedown', 'message-item', PAGE.mouseDown);
        window.addEventListener('mousemove', this.mouseMove);
        window.addEventListener('mouseup', this.mouseUp);

        let messageDelete = document.getElementsByClassName('message-delete');
        for(let i = 0; i < messageDelete.length; i++){
            messageDelete[i].addEventListener('click', this.deleteCard);
        }

        this.onEventListener(messageBoard, 'click', 'message-delete', this.deleteCard);
        window.addEventListener('unload',PAGE.saveData);
    },
    onEventListener: function(parentNode, action, childClassName, callback){
        parentNode.addEventListener(action, function(e){
            parentNode.className.indexOf(childClassName) && callback(e);
        })
    },
    //获取数据
    getData:function(){
        let cardList = localStorage.getItem('card');
        cardList = JSON.parse(cardList) || [];
        PAGE.data.cardList = cardList;
    },
    //存取数据
    saveData: function(){
        console.log(PAGE.data.cardList);
        let cardList = PAGE.data.cardList;
        let cardListStr = JSON.stringify(cardList);
        // console.log(cardList);
        localStorage.setItem('card',cardListStr);
    },
    //留言板交互，留言卡片可以拖动但不离开留言框。
    mouseDown: function(e){
        let cardItem = e.target;
        if(cardItem.className != 'message-item'){
            return;
        }
        PAGE.data.itemoffsetTop = cardItem.offsetTop;
        PAGE.data.itemoffsetLeft = cardItem.offsetLeft;
        PAGE.data.cardItem = e.target; 
        cardItem.style.zIndex = ++ PAGE.data.zIndex;
        PAGE.data.pageX = e.pageX;
        PAGE.data.pageY = e.pageY;
        PAGE.data.isLock = false;
    },
    mouseMove: function(e){
        if(!PAGE.data.isLock){
            let messageBoard = document.getElementById('message-board');
            let cardContainerHeight = messageBoard.offsetHeight;
            let cardContainerWidth = messageBoard.offsetWidth;
            let cardWidth = PAGE.data.cardWidth;
            let cardHeight = PAGE.data.cardHeight;
            let containerPadding = PAGE.data.containerPadding;

            let maxWidth = cardContainerWidth - cardWidth - containerPadding;
            let maxHeight = cardContainerHeight - cardHeight - containerPadding;

            let translateX = e.pageX - PAGE.data.pageX + PAGE.data.itemoffsetLeft;
            let translateY =  e.pageY - PAGE.data.pageY + PAGE.data.itemoffsetTop;
            translateX = maxWidth > translateX ? translateX : maxWidth;
            translateY = maxHeight > translateY ? translateY : maxHeight;
            translateX = translateX > containerPadding ? translateX : containerPadding;
            translateY = translateY > containerPadding ? translateY : containerPadding;
            
            PAGE.data.cardItem.style.left = translateX + "px";
            PAGE.data.cardItem.style.top = translateY + "px";
        }
    },
    mouseUp: function(){
        PAGE.data.isLock = true;
    },

    //删除留言
    deleteCard: function(e){
        let deleteButton = e.target; 
        if(deleteButton.className != 'message-delete'){
            return;
        }
        let cardItem = e.target.parentNode;
        cardItem.remove();
        let cardList = PAGE.data.cardList;
        let dataIndex = cardItem.dataset.dataIndex;
        cardList.splice(dataIndex,1);
    },
    //这里不用了
    // setCardList: function(){
    //     let messageInputs = document.getElementsByClassName('message-input');
    //     for (let i = 0; i < messageInputs.length; i++) {
    //         let content = messageInputs[i].value;
    //         PAGE.data.cardList.push(content);
    //     }
    // },

    addCardEnter: function(e){
        let message = this.value.trim();
        if(e.which !== 13 || !message){
            return;
        }
        let messageValue = this.value;
        PAGE.addCard(messageValue);
    },
    
    //完成留言功能，输入留言提交到留言板。
    addCardButton: function(e){
        let addButton = e.target;
        let message = document.getElementById('message-input').value.trim();
        if(addButton.className !== 'message-btn'|| !message){
            return;
        }
        let messageValue = this.value;
        PAGE.addCard(messageValue);
    },
    //添加卡片；
    addCard: function(v){
        let messageInput = document.getElementById('message-input');
        let messageBoard =document.getElementById('message-board');
        
        let messageItem = document.createElement('div');
        let messageDelete = document.createElement('img');
        let messageStickerContainer = document.createElement('div');
        let messageStickerLeft = document.createElement('img');
        let messageStickerRight = document.createElement('img');
        
        let message = document.getElementById('message-input').value.trim();
        messageItem.innerHTML = '小兔说：' + message;
        
        messageItem.setAttribute('class','message-item');
        messageItem.setAttribute('id','message-item');///
        
        messageDelete.setAttribute('class','message-delete');
        messageStickerContainer.setAttribute('class','message-sticker-container');
        messageStickerLeft.setAttribute('class','message-sticker left');
        messageStickerRight.setAttribute('class','message-sticker right');

        messageDelete.setAttribute('src','./image/关闭.png')
        messageStickerLeft.setAttribute('src','./image/message_bg_left.png');
        messageStickerRight.setAttribute('src','./image/message_bg_right.png');
        
        let zIndex = ++ PAGE.data.zIndex;
        let dataIndex = ++PAGE.data.dataIndex;
        messageItem.setAttribute('data-index',`${dataIndex}`);

        let containerpadding = PAGE.data.containerPadding;
        let cardContainerHeight = messageBoard.offsetHeight;
        let cardContainerWidth = messageBoard.offsetWidth;

        let cardWidth = PAGE.data.cardWidth;
        let cardHeight = PAGE.data.cardHeight;
        let maxWidth = cardContainerWidth - cardWidth - containerpadding;
        let maxHeight = cardContainerHeight - cardHeight - containerpadding;

        let randomTop = PAGE.randomPosition(containerpadding, maxHeight);
        let randomLeft = PAGE.randomPosition(containerpadding, maxWidth);
        let backgroundColor = backgroundColors[zIndex % backgroundColors.length];
        let styleStr = `
            z-Index : ${zIndex};
            top:${randomTop}px;
            left: ${randomLeft}px;
            background-color: ${backgroundColor};
        `
        messageItem.setAttribute('style',styleStr);

        messageBoard.appendChild(messageItem);

        messageItem.appendChild(messageStickerContainer);
        messageItem.appendChild(messageDelete);
        messageStickerContainer.appendChild(messageStickerLeft);
        messageStickerContainer.appendChild(messageStickerRight);

        let cardList = PAGE.data.cardList;
        cardList.push({title: message});
        document.getElementById('message-input').value ='';
    },
    randomPosition:function(min,max){
        return Math.floor(Math.random() * (max-min) + min);
    },
}
PAGE.init();