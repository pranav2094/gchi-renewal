import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-razor-pay-fallback',
  templateUrl: './razor-pay-fallback.component.html',
  styleUrls: ['./razor-pay-fallback.component.scss']
})
export class RazorPayFallbackComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    window.addEventListener('message', function (event) {
      if (typeof event.data == 'object' && event.data.razorPayDetails) {
        console.log(event);
        // this.post1(event.data.url, event.data.razorPayDetails);
        let method = "post"; // Set method to post by default if not specified.
        var form = document.createElement("form");
        form.setAttribute("method", method);
        form.setAttribute("action", event.data.url);
        //form.setAttribute("target", "iFrame123");
        for (var key in event.data.razorPayDetails) {
          if (event.data.razorPayDetails.hasOwnProperty(key)) {
            var hiddenField = document.createElement("input");
            hiddenField.setAttribute("type", "hidden");
            hiddenField.setAttribute("name", key);
            hiddenField.setAttribute("value", event.data.razorPayDetails[key]);

            form.appendChild(hiddenField);
          }
        }
        console.log("form===", form);

        document.body.appendChild(form);
        form.submit();

      }
    }, false);

    console.log("FALLBACK", window);



  }
}
