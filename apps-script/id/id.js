const COLS = 2;
const ROWS = 5;
const CARD_WIDTH = 242.676;
const CARD_HEIGHT = 153.09;
const SEPARATOR = 1;
const TOP_OFFSET = 36;
const LEFT_OFFSET = 55.8;
const LEFT_OFFSET_BACK = 55.8;
kidsIdSlides = SlidesApp.openById(
  PropertiesService.getScriptProperties().getProperty('kids_id_slides')
);
// usersIdSlides = SlidesApp.openById(
//   PropertiesService.getScriptProperties().getProperty('users_id_slides')
// );

function generateIds(entity, ids, token) {
  if (!hasAccess(token, entity, 'view')) {
    throw new Error('Unauthorized');
  }
  var data = ids.map((id) => {
    return JSON.parse(apiFetch('kids', 'GET', {id:id}) || {id: id});
  });
  console.log(data);
  
  removeAllSlides(kidsIdSlides);

  //batch = set of ids in a page including front and back pages
  const batches = Math.ceil(data.length / (COLS * ROWS));
  for (var batch = 1; batch <= batches; batch++) {
    var batchData = data.slice(
      (batch - 1) * COLS * ROWS,
      batch * COLS * ROWS
    );
    createFrontPage(kidsIdSlides, batchData);
    createBackPage(kidsIdSlides, batchData);
  }
}

function getPdfUrl(entity, token) {
  if (!hasAccess(token, entity, 'view')) {
    throw new Error('Unauthorized');
  }
  var slides = null;
  if (entity === 'kids') {
    slides = kidsIdSlides;
  }
  
  return 'https://docs.google.com/presentation/d/' + slides.getId() + '/export/pdf';
}

function setTextStyle(textBox, fontFamily, fontSize, color, bold = false) {
  const textStyle = textBox.getText().getTextStyle();
  textStyle.setFontFamily(fontFamily);
  textStyle.setFontSize(fontSize);
  textStyle.setForegroundColor(color);
  textStyle.setBold(bold);
  textBox.getText().getParagraphStyle().setSpaceAbove(0);
}

function createFrontPage(slides, batchData) {
  const slide = slides.appendSlide(getLayout(slides, 'CUSTOM_1_1'));
  var left_offset, top_offset;
  var counter = 0;
  for (var i = 0; i < ROWS; i++) {
    for (var j = 0; j < COLS; j++) {
      if (counter >= batchData.length) {
        return;
      }
      left_offset = LEFT_OFFSET + j * (CARD_WIDTH);
      top_offset = TOP_OFFSET + i * (CARD_HEIGHT);
      var childsDetails = batchData[counter];
      slide.insertImage(
        generateBarcode('Please use the NxtGen App QR scanner||kids||Check-in||' + childsDetails.id), 
        left_offset + 9, top_offset + 51.7, 95, 95
      );
      var name =  (childsDetails.name || ' ')
          .split(' ').slice(0, 2).join(' ');
      var nameBox = slide.insertTextBox(name, left_offset + 103.32, top_offset + 46.1, 128, 73);
      nameBox.getText().getParagraphStyle().setParagraphAlignment(SlidesApp.ParagraphAlignment.CENTER);
      nameBox.setContentAlignment(SlidesApp.ContentAlignment.MIDDLE);
      setTextStyle(nameBox, 'Century Gothic', 20, '#000000', true);
      setFontSizeToFit(nameBox, 'Century Gothic', 20, 8);
      var idBox = slide.insertTextBox(childsDetails.id || ' ', left_offset + 103, top_offset + 120, 129, 32);
      idBox.getText().getParagraphStyle().setParagraphAlignment(SlidesApp.ParagraphAlignment.CENTER);
      idBox.setContentAlignment(SlidesApp.ContentAlignment.MIDDLE);
      setTextStyle(idBox, 'Century Gothic', 13, '#FFFFFF', true);
      counter++;
    }
  }
}

function createBackPage(slides, batchData) {
  const slide = slides.appendSlide(getLayout(slides, 'CUSTOM_1'));
  var left_offset, top_offset;
  var counter = 0;
  for (var i = 0; i < ROWS; i++) {
    for (var j = COLS - 1; j >= 0; j--) { // Swap columns to match the front page
      if (counter >= batchData.length) {
        return;
      }
      left_offset = LEFT_OFFSET_BACK + j * (CARD_WIDTH);
      top_offset = TOP_OFFSET + i * (CARD_HEIGHT);
      var childsDetails = batchData[counter];
      if (childsDetails.name !== '') {
        slide.insertImage(
          'https://i.ibb.co/gw0gH3w/Kid-Profile.png', 
          left_offset + 9.72, top_offset + 61.2, 79.92, 79.92
        );
      } else {
        slide.insertImage(
          generateBarcode('https://nxtgen.short.gy/v1?register=' + batchData[counter].id), 
          left_offset + 9.72, top_offset + 61.2, 79.92, 79.92
        );
      }
      var nameBox = slide.insertTextBox(childsDetails.id + '. ' + childsDetails.name, left_offset + 7.56, top_offset + 3.6, 227.52, 15.12);
      setTextStyle(nameBox, 'Century Gothic', 10, '#000000');
      var parentBox = slide.insertTextBox(childsDetails.parent || ' ', left_offset + 7.56, top_offset + 24.48, 227.52, 15.12);
      setTextStyle(parentBox, 'Century Gothic', 10, '#000000');
      var contactBox = slide.insertTextBox(childsDetails.parent_contact || ' ', left_offset + 96.84, top_offset + 51.12, 138.96, 21);
      setTextStyle(contactBox, 'Century Gothic', 10, '#000000');
      var bdayBox = slide.insertTextBox(childsDetails.birthday || ' ', left_offset + 96.84, top_offset + 75.6, 138.96, 21);
      setTextStyle(bdayBox, 'Century Gothic', 10, '#000000');
      var nicknameBox = slide.insertTextBox(childsDetails.nickname || ' ', left_offset + 96.84, top_offset + 100.08, 138.96, 21);
      setTextStyle(nicknameBox, 'Century Gothic', 10, '#000000');
      counter++;
    }
  }
}

function setFontSizeToFit(textBox, fontFamily, initialFontSize, minFontSize) {
  var textStyle = textBox.getText().getTextStyle();
  textStyle.setFontFamily(fontFamily);
  var fontSize = initialFontSize;
  textStyle.setFontSize(fontSize);
  
  // Check if text overflows and adjust font size
  while (isTextOverflowing(textBox) && fontSize > minFontSize) {
    fontSize -= 1;
    textStyle.setFontSize(fontSize);
  }
}

function removeAllSlides(presentation) {
  const slides = presentation.getSlides(); // Get all slides

  for (let i = slides.length - 1; i >= 0; i--) { // Loop backward
    slides[i].remove(); // Remove each slide
  }
}

function getLayout(presentation, layoutName) {
  const layouts = presentation.getLayouts();
  
  for (let i = 0; i < layouts.length; i++) {
    if (layouts[i].getLayoutName() === layoutName) {
      return layouts[i];
    }
  }

  return null;
}

function isTextOverflowing(textBox) {
  var textRange = textBox.getText();
  var renderedText = textRange.asRenderedString();
  var textBoxHeight = textBox.getHeight();
  var textBoxWidth = textBox.getWidth();
  
  // Approximate the height of the text by counting the number of lines
  var lines = renderedText.split('\n').length;
  var lineHeight = textRange.getTextStyle().getFontSize() * 1.2; // Approximate line height
  var totalTextHeight = lines * lineHeight;
  
  return totalTextHeight > textBoxHeight;
}

function generateBarcode(str){
  var url = 'https://quickchart.io/qr?text=' + encodeURIComponent(str);
  var response = UrlFetchApp.fetch(url);

  return response.getBlob();
}