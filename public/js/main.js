$(function initializeMap () {

  const fullstackAcademy = new google.maps.LatLng(40.705086, -74.009151);

  const styleArr = [
    {
      featureType: 'landscape',
      stylers: [{ saturation: -100 }, { lightness: 60 }]
    },
    {
      featureType: 'road.local',
      stylers: [{ saturation: -100 }, { lightness: 40 }, { visibility: 'on' }]
    },
    {
      featureType: 'transit',
      stylers: [{ saturation: -100 }, { visibility: 'simplified' }]
    },
    {
      featureType: 'administrative.province',
      stylers: [{ visibility: 'off' }]
    },
    {
      featureType: 'water',
      stylers: [{ visibility: 'on' }, { lightness: 30 }]
    },
    {
      featureType: 'road.highway',
      elementType: 'geometry.fill',
      stylers: [{ color: '#ef8c25' }, { lightness: 40 }]
    }, 
    {
      featureType: 'road.highway',
      elementType: 'geometry.stroke',
      stylers: [{ visibility: 'off' }]
    }, 
    {
      featureType: 'poi.park',
      elementType: 'geometry.fill',
      stylers: [{ color: '#b6c54c' }, { lightness: 40 }, { saturation: -40 }]
    }
  ];

  const mapCanvas = document.getElementById('map-canvas');

  const currentMap = new google.maps.Map(mapCanvas, {
    center: fullstackAcademy,
    zoom: 13,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    styles: styleArr
  });

  // const iconURLs = {
  //   hotel: '/images/lodging_0star.png',
  //   restaurant: '/images/restaurant.png',
  //   activity: '/images/star-3.png'
  // };

  function drawMarker (type, coords) {
    // TODO: Pan map / recalculate viewport here maybe?
    const latLng = new google.maps.LatLng(coords[0], coords[1]);
    const marker = new google.maps.Marker({
      position: latLng
    });
    marker.setMap(currentMap);
    return marker
  }

  // 0. Fetch the database, parsed from json to a js object
  const db = fetch('/api').then(r => r.json())

  // TODO: 
  // 1. Populate the <select>s with <option>s
  $('select').each(
    (_index, select) => {
      db.then(db =>
        $(select).append(
          db[select.dataset.type].map (
            item => Object.assign(
              $(`<option>${item.name}</option>`)[0]
              , {
                item: item,
              })
          )
        )
      )
    })

  // 2. Wire up the add buttons
  // We could do this if we wanted to select by the add
  // dataset item instead:
  //
  //   $('button[data-action="add"]').click(
  $('button.add').click(    
    evt =>
      $(evt.target.dataset.from)
        .find('option:selected')
        .each((_i, option) => {
          const item = option.item
              , type = $(option)
                  .closest('select')[0]
                  .dataset.type

          // Make a li out of this item
          const li = $(`<li>${item.name} <button class='del'>x</button></li>`)[0]

          // Draw a marker on the map and attach the marker to the li
          li.marker = drawMarker(type, item.place.location)

          // Add this item to our itinerary for the current day
          $('.current.day').append(li)
        })
  )

  // 3. Wire up delete buttons
  $(document).on('click', 'button.del',
    evt => $(evt.target).closest('li').each((_i, li) => {
      li.marker.setMap(null)
      $(li).remove()
    })
  )

let days = 0;
  // 4. Deal with adding days
  $('button.addDay').click(
    evt => {
      // Deselect all days
      $('.day.current').removeClass('current')
      
      // Add a new day
      $(evt.target).before(
        $(`<ol class="current day"><h3><span class=day-head></span><button class=delDay>x</button></h3></ol>`)
      )

      numberDays()
      days++;

      $.ajax({
        method: 'POST',
        url: `/api/day/${days}`
      })
      //whatever is returned from the back-end
      .then(function(data) {
        console.log(data);
        data.number = ($(".day").length);
      })
    }
  )

  function numberDays() {
    $('.day').each((index, day) =>
      $(day).find('.day-head').text(`day ${index + 1}`)
    )
  }

  // 5. Deal with switching days
  $(document).on('click', '.day-head',
    evt => {
      $('.day.current').removeClass('current')
      const $day = $(evt.target).closest('.day')
      //_i is placeholder for index
      //li is the actual list item
      $('li').each((_i, li) => li.marker && li.marker.setMap(null))      
      $day.addClass('current')
      $day.find('li').each((_i, li) => li.marker.setMap(currentMap))
    }
  )

  // 6. Remove a day
  $(document).on('click', 'button.delDay',
    evt => {
      console.log('hit delDay');
      const $day = $(evt.target).closest('.day')
      console.log($day);
      if ($day.hasClass('current')) {
        const prev = $day.prev('.day')[0]
            , next = $day.next('.day')[0]
        $day.removeClass('current')
        $(prev || next).addClass('current')
      }

      $day.find('li').each((_i, li) => li.marker.setMap(currentMap))      
      $day.remove()
      numberDays()
    })

  // When we start, add a day
    $(function() {
      $.ajax({
        method: 'GET',
        url: '/api/day',

      })
      .then(function(days) {
        console.log(days);
        days.forEach(function(day) {
          $('.addDay').click();

          day.restaurants.forEach(function(restaurant) {

            //turning the string into a JQuery object, then we set the first element to be the new restaurant
            //JQuery knows when you give it [0] to look for the innerHTML

            let li = $(`<li>${restaurant.name} <button class="del">x</button></li>`)[0];
            //could try adding them using the restaurant add button
            li.marker = drawMarker(restaurant, restaurant.place.location);
            $(".current").append(li);
            console.log(li);
          })

          day.activities.forEach(function(activity) {
            let li = $(`<li>${activity.name} <button class="del">x</button></li>`)[0];
            li.marker = drawMarker(activity, activity.place.location);
            $(".current").append(li);

          })

          let li = $(`<li>${day.hotel.name} <button class="del">x</button></li>`)[0];
          var hotel = day.hotel;
            li.marker = drawMarker(hotel, hotel.place.location);
          $(".current").append(li);
        })
      })
      .catch(console.error);
    })


  // $('#control-panel').on('click', (e) => {
  //   console.log('clicked')
  //   fetch('/api/day').then(data => {
  //     console.log('GET response data: ', data)
  //   })
  // })


});


