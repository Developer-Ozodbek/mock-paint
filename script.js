//! DOM Variablies
const canvas = document.querySelector('canvas'),
      toolBtns = document.querySelectorAll('.tool'),
      fillColor = document.querySelector('#fill-color'),
      sizeSlider = document.querySelector('#size-slider'),
      colorBtns = document.querySelectorAll('.colors .option'),
      colorPicker = document.querySelector('#color-picker'),
      clearCanvasBtn = document.querySelector('.clear-canvas'),
      saveImgBtn =  document.querySelector('.save-img')
//! Global Variablies
let ctx = canvas.getContext('2d'),
    isDrawing = false,
    brushWidth = 5,
    selectedTool = 'brush',
    selectedColor = '#000',
    prevMouseX,
    prevMouseY,
    snapshot

//? SET CANVAS BACKGROUND
const setCanvasBg = () =>{
    ctx.fillStyle = '#fff'
    ctx.fillRect(0,0, canvas.width, canvas.height)
    ctx.fillStyle = selectedColor
}

//? Set canvas Width and Height
window.addEventListener('load', () => {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    setCanvasBg()
})
//? Start Draw
const startDraw = e => {
    isDrawing = true
    prevMouseX = e.offsetX
    prevMouseY = e.offsetY
    ctx.beginPath()
    ctx.lineWidth = brushWidth
    ctx.strokeStyle = selectedColor
    ctx.fillStyle = selectedColor
    snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height)
}
//? Draw Rectangle
const drawRectangle = e => {
       !fillColor.checked ?
       ctx.strokeRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY) :
       ctx.fillRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY)
}
//? Draw Circle
const drawCircle = e => {
    ctx.beginPath()
    const radius = Math.sqrt(Math.pow((prevMouseX - e.offsetX), 2)) + Math.pow((prevMouseY - e.offsetY), 2)
    ctx.arc(prevMouseX, prevMouseY, radius,0, 2 * Math.PI)
    fillColor.checked ? ctx.fill() : ctx.stroke()
}
//? Draw Triangle
const drawTriangle = e => {
    ctx.beginPath()
    ctx.moveTo(prevMouseX, prevMouseY)
    ctx.lineTo(e.offsetX, e.offsetY)
    ctx.lineTo(prevMouseX * 2 - e.offsetX, e.offsetY)
    ctx.closePath()
    ctx.stroke()
    fillColor.checked ? ctx.fill() : ctx.stroke()
}
//? Drawing
const drawing = e => {
    if(!isDrawing) return
    ctx.putImageData(snapshot, 0 ,0)

    if(selectedTool == 'brush' || selectedTool == 'eraser'){
        ctx.strokeStyle = selectedTool == 'eraser' ? '#fff' : selectedColor
        ctx.lineTo(e.offsetX, e.offsetY)
        ctx.stroke()
    }
    switch (selectedTool) {
        case 'rectangle':
            drawRectangle(e)
            break;
        case 'circle':
            drawCircle(e)
            break;
        case 'triangle':
            drawTriangle(e)
          break;
        default:
            break;
    }
}
//? ToolBtn and Color Btns FOREACH
toolBtns.forEach(btn => {
    btn.addEventListener('click', () =>{
        document.querySelector('.options .active').classList.remove('active')
        btn.classList.add('active')
        selectedTool = btn.id
        console.log(`selected tool is ${selectedTool}`);
    })
})
colorBtns.forEach(btn =>{
    btn.addEventListener('click', e=> {
        document.querySelector('.options .selected').classList.remove('selected')
        btn.classList.add('selected')
        const bgColor = window.getComputedStyle(btn).getPropertyValue('background-color')
        selectedColor = bgColor
    })
})

//? Change Brush Width
sizeSlider.addEventListener('change', () => (brushWidth = sizeSlider.value))

//? Set Color from Color Picker
colorPicker.addEventListener('change', ()=>{
    colorPicker.parentElement.style.background = colorPicker.value
    colorPicker.parentElement.click()
})
//? Clear Canvas Button
clearCanvasBtn.addEventListener('click', ()=>{
    ctx.clearRect(0,0, canvas.width, canvas.height)
    setCanvasBg()
})

// ? SAVE OUR PAINT AS JPG
saveImgBtn.addEventListener('click', ()=>{
    const link = document.createElement('a')
    link.download = `mockPaint${Date.now()}.jpg`
    link.href = canvas.toDataURL()
    link.click()
})

//? Stop Draw
const stopDraw = () => isDrawing = false

//? Canvas EVENTS
canvas.addEventListener('mousedown', startDraw)
canvas.addEventListener('mousemove', drawing)
canvas.addEventListener('mouseup', stopDraw)

