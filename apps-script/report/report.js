
AttendanceReportSlides = SlidesApp.openById(
  PropertiesService.getScriptProperties().getProperty('attendance_report_slides')
);

function px(value) {
  return value * 72;
}

function generateReport(filters, token) {
  if (!hasAccess(token, 'kids', 'view')) {
    throw new Error('Unauthorized');
  }
  const services = {
      "First Service" : {
          label: "First Service",
          value: "09:00:00 AM",
          startRange: "07:30:00 AM",
          endRange: "10:30:00 AM"
      },
      "Second Service" : {
          label: "Second Service",
          value: "12:00:00 PM",
          startRange: "10:30:00 AM",
          endRange: "01:30:00 PM"
      },
      "Third Service" : {
          label: "Third Service",
          value: "03:00:00 PM",
          startRange: "01:30:00 PM",
          endRange: "04:30:00 PM"
      },
      // For testing only
      // "Fourth Service" : {
      //     label: "Fourth Service",
      //     value: "07:00:00 PM",
      //     startRange: "05:30:00 PM",
      //     endRange: "08:30:00 PM"
      // }
  };

  const parsedData = JSON.parse(apiFetch('logs_kids', 'GETALL', {
    date: filters.date,
    level: filters.level
  }));
  let filteredData = parsedData.filter(data => {
      let dummyDate = 'January 1, 1970 ';
      let time = new Date(dummyDate + data.time);
      let timeFrom = new Date(dummyDate + services[filters.service].startRange);
      let timeTo = new Date(dummyDate + services[filters.service].endRange);

      return time >= timeFrom && time <= timeTo;
  });

  removeAllSlides(AttendanceReportSlides);
  const slide = AttendanceReportSlides.appendSlide(getLayout(AttendanceReportSlides, 'CUSTOM_1_1'));
  var dateBox = slide.insertTextBox(filters.date, 136.8, 105.84, 319.68,  29.52);
  dateBox.getText().getParagraphStyle().setParagraphAlignment(SlidesApp.ParagraphAlignment.CENTER);
  dateBox.setContentAlignment(SlidesApp.ContentAlignment.MIDDLE);
  setTextStyle(dateBox, 'Arial', 15, '#000000');
  var levelBox = slide.insertTextBox(filters.level, 138.96, 129.6, 319.68,  29.52);
  levelBox.getText().getParagraphStyle().setParagraphAlignment(SlidesApp.ParagraphAlignment.CENTER);
  levelBox.setContentAlignment(SlidesApp.ContentAlignment.MIDDLE);
  setTextStyle(levelBox, 'Arial', 15, '#000000');

  var top_offset = 213.12;
  filteredData.forEach((data, index) => {
    var indexBox = slide.insertTextBox(index + 1, 36.72, top_offset,  33.84,  29.52);
    indexBox.getText().getParagraphStyle().setParagraphAlignment(SlidesApp.ParagraphAlignment.CENTER);
    indexBox.setContentAlignment(SlidesApp.ContentAlignment.MIDDLE);
    setTextStyle(indexBox, 'Arial', 10, '#000000');
    var nameBox = slide.insertTextBox(data.name,  70.56, top_offset, px(2.24),  29.52);
    nameBox.getText().getParagraphStyle().setParagraphAlignment(SlidesApp.ParagraphAlignment.START);
    nameBox.setContentAlignment(SlidesApp.ContentAlignment.MIDDLE);
    setTextStyle(nameBox, 'Arial', 10, '#000000');
    var timeBox = slide.insertTextBox(data.time,  231.84, top_offset, px(0.92),  29.52);
    timeBox.getText().getParagraphStyle().setParagraphAlignment(SlidesApp.ParagraphAlignment.CENTER);
    timeBox.setContentAlignment(SlidesApp.ContentAlignment.MIDDLE);
    setTextStyle(timeBox, 'Arial', 8, '#000000');
    var contactBox = slide.insertTextBox(data.parent_contact,  295.92, top_offset,  82.8,  29.52);
    contactBox.getText().getParagraphStyle().setParagraphAlignment(SlidesApp.ParagraphAlignment.CENTER);
    contactBox.setContentAlignment(SlidesApp.ContentAlignment.MIDDLE);
    setTextStyle(contactBox, 'Arial', 10, '#000000');
    var parentBox = slide.insertTextBox(data.parent,  378.72, top_offset,   195.84,  29.52);
    parentBox.getText().getParagraphStyle().setParagraphAlignment(SlidesApp.ParagraphAlignment.START);
    parentBox.setContentAlignment(SlidesApp.ContentAlignment.MIDDLE);
    setTextStyle(parentBox, 'Arial', 10, '#000000');

    top_offset += 29.52;
  });

}

function getPdfReportUrl(token) {
  if (!hasAccess(token, 'kids', 'view')) {
    throw new Error('Unauthorized');
  }
  
  return 'https://docs.google.com/presentation/d/' + AttendanceReportSlides.getId() + '/export/pdf';
}