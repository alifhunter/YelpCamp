const mongoose = require("mongoose"),
      Campground = require("./models/campground"),
      Comment = require("./models/comment");

const seeds = [
    {
        name: 'Bogor Hill', 
        image: 'https://nos.wjv-1.neo.id/wisatahalimun/2016/06/wisata-halimun-puncak-highland-camping-ground.jpg', 
        description: 'bla bla bla'
    },
    {
        name: 'Bandung Creek', 
        image: 'https://r-cf.bstatic.com/images/hotel/max1024x768/189/189188180.jpg', 
        description: 'bla bla bla'
    },
    {
        name: 'Jakarta Basecamp', 
        image: 'https://s4.bukalapak.com/bukalapak-kontenz-production/content_attachments/39029/original/47583532_315344865980826_898844816911994876_n_2.jpg', 
        description: 'bla bla bla'
    }
];

// ASNYC 
// function seedDB(){
//     //Remove all campgrounds
//     Campground.deleteMany({}, function(err){
//          if(err){
//              console.log(err);
//          }
//          console.log("removed campgrounds!");
//          Comment.remove({}, function(err) {
//              if(err){
//                  console.log(err);
//              }
//              console.log("removed comments!");
//               //add a few campgrounds
//              seeds.forEach(function(seed){
//                  Campground.create(seed, function(err, campground){
//                      if(err){
//                          console.log(err)
//                      } else {
//                          console.log("added a campground");
//                          //create a comment
//                          Comment.create(
//                              {
//                                  text: "This place is great, but I wish there was internet",
//                                  author: "Homer"
//                              }, function(err, comment){
//                                  if(err){
//                                      console.log(err);
//                                  } else {
//                                      campground.comments.push(comment);
//                                      campground.save();
//                                      console.log("Created new comment");
//                                  }
//                              });
//                      }
//                  });
//              });
//          });
//      }); 
//      //add a few comments
//  }

function seedDB(){
    //Remove all campgrounds
    Campground.deleteMany({}, (err) => {
        if(err){
            console.log(err);
        } else {
            console.log("removed campgrounds");
            //Add campgrounds
            seeds.forEach((seed) => {
                Campground.create(seed, (err, camp) => {
                    if(err){
                        console.log(err);
                    } else {
                        console.log("Added a campground");
                        // create a comment
                        Comment.create(
                            {
                                text: "this is dope",
                                author: "Ben"
                            }, (err, comment) => {
                                if(err){
                                    console.log(err);
                                } else {
                                    camp.comments.push(comment);
                                    camp.save();
                                    console.log("created new comment");
                                }
                            }
                        );
                    }
                });
            });
        }
    });
}

module.exports = seedDB;
