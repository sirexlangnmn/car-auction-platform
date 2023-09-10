let listOfAuctions = getId('listOfAuctions');

document.addEventListener('DOMContentLoaded', async function () {
    await displayListOfAuctions();
});

async function displayListOfAuctions() {
    try {
        const response = await fetch('/api/get/list-of-auctions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();

        listOfAuctions.innerHTML = '';

        for (let i = 0; i < data.length; i++) {
            const carId = data[i]['id'];
            const brand = data[i]['brand'];
            const year = data[i]['year'];
            const type = data[i]['type'];
            const opening_price = data[i]['opening_price'];
            const price_increment = data[i]['price_increment'];
            const current_bid = data[i]['current_bid'];
            const expiryDate = data[i]['expiry_date'];
            const uuid = data[i]['uuid'];
            const userUuid = data[i]['user_uuid'];

            listOfAuctions.innerHTML += `<div class="col-sm-10 col-md-6 col-lg-4">
                <div class="auction-item-2">
                    <div class="auction-thumb">
                        <a href="./product-details.html"><img src="./assets/images/auction/product/01.png" alt="product"></a>
                        <a href="#0" class="rating"><i class="far fa-star"></i></a>
                        <a href="#0" class="bid"><i class="flaticon-auction"></i></a>
                    </div>
                    <div class="auction-content">
                        <h6 class="title">
                            <a href="#0">${year} ${brand} ${type}</a>
                        </h6>
                        <div class="bid-area">
                            <div class="bid-amount">
                                <div class="icon">
                                    <i class="flaticon-auction"></i>
                                </div>
                                <div class="amount-content">
                                    <div class="current">Current Bid</div>
                                    <div class="amount" id="amount${carId}">₱ ${current_bid} </div>
                                </div>
                            </div>
                            <div class="bid-amount">
                                <div class="icon">
                                    <i class="flaticon-money"></i>
                                </div>
                                <div class="amount-content">
                                    <div class="current">Opening Price</div>
                                    <div class="amount">₱ ${opening_price} </div>
                                </div>
                            </div>
                        </div>
                        <div class="countdown-area">
                            <div class="countdown">
                            <div id="bid_counter${carId}">${expiryDate}</div>
                            </div>
                            <span class="total-bids">₱ ${price_increment} Bid</span>
                        </div>
                        <div class="text-center mb-20">
                            <a href="#0" class="custom-button" onclick="closeListing('${uuid}')">Close Listing</a>

                        </div>
                        <div class="text-center">
                        <a href="#0" class="custom-button yellow" onclick="permanentlyDelete()">Permanently Delete</a>
                        </div>
                    </div>
                </div>
            </div>`;

            expiryDateCountdown(expiryDate, `bid_counter${carId}`);
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}


function expiryDateCountdown(expiryDate, elementId) {
    $(document).ready(function () {
        //Bidding All Events Here
        if ($("#" + elementId).length) {

            // Create a Date object from the input string
            var date = new Date(expiryDate);

            // Extract year, month, and day components
            var year = date.getFullYear();
            var month = date.getMonth() + 1; // Months are 0-based, so add 1
            var day = date.getDate();

            // Format the components into the desired string format
            var formattedDate = `${year}/${month}/${day}`;

            // If you need specific date then comment out 1 and comment in 2
            // let endDate = "2020/03/20"; //This is 1
            let endDate = (new Date().getFullYear()) + '/' + (new Date().getMonth() + 1) + '/' + (new Date().getDate() + 1); //This is 2

            let counterElement = document.querySelector("#" + elementId);
            let myCountDown = new ysCountDown(formattedDate, function (remaining, finished) {
                let message = "";
                if (finished) {
                    message = "Expired";
                } else {
                    var re_days = remaining.totalDays;
                    var re_hours = remaining.hours;
                    message += re_days + "d  : ";
                    message += re_hours + "h  : ";
                    message += remaining.minutes + "m  : ";
                    message += remaining.seconds + "s";
                }
                counterElement.textContent = message;
            });
        }


    });
}




function displayListOfAuctions2() {
    $.ajax({
        url: '/api/get/list-of-auctions',
        type: 'POST',
        success: function (data) {
            listOfAuctions.innerHTML = '';

            for (let i = 0; i < data.length; i++) {
                const carId = data[i]['id'];
                const brand = data[i]['brand'];
                const year = data[i]['year'];
                const type = data[i]['type'];
                const opening_price = data[i]['opening_price'];
                const price_increment = data[i]['price_increment'];
                const current_bid = data[i]['current_bid'];
                const expiryDate = data[i]['expiry_date'];
                const uuid = data[i]['uuid'];
                const userUuid = data[i]['user_uuid'];

                listOfAuctions.innerHTML += `<div class="col-sm-10 col-md-6 col-lg-4">
                    <div class="auction-item-2">
                        <div class="auction-thumb">
                            <a href="./product-details.html"><img src="./assets/images/auction/product/01.png" alt="product"></a>
                            <a href="#0" class="rating"><i class="far fa-star"></i></a>
                            <a href="#0" class="bid"><i class="flaticon-auction"></i></a>
                        </div>
                        <div class="auction-content">
                            <h6 class="title">
                                <a href="#0">${year} ${brand} ${type}</a>
                            </h6>
                            <div class="bid-area">
                                <div class="bid-amount">
                                    <div class="icon">
                                        <i class="flaticon-auction"></i>
                                    </div>
                                    <div class="amount-content">
                                        <div class="current">Current Bid</div>
                                        <div class="amount" id="amount${carId}">₱ ${current_bid} </div>
                                    </div>
                                </div>
                                <div class="bid-amount">
                                    <div class="icon">
                                        <i class="flaticon-money"></i>
                                    </div>
                                    <div class="amount-content">
                                        <div class="current">Opening Price</div>
                                        <div class="amount">₱ ${opening_price} </div>
                                    </div>
                                </div>
                            </div>
                            <div class="countdown-area">
                                <div class="countdown">
                                <div id="bid_counter${carId}">${expiryDate}</div>
                                </div>
                                <span class="total-bids">₱ ${price_increment} Bid</span>
                            </div>
                            <div class="text-center mb-20">
                            <a href="#0" class="custom-button" onclick="closeListing('${uuid}')">Close Listing</a>
                            </div>
                            <div class="text-center">
                            <a href="#0" class="custom-button yellow" onclick="permanentlyDelete()">Permanently Delete</a>
                            </div>
                        </div>
                    </div>
                </div>`;

                expiryDateCountdown(expiryDate, `bid_counter${carId}`);
            }
        },
    });
}

function permanentlyDelete() {
    Swal.fire({
        title: 'Warning',
        text: "I skip this permanently delete function",
        icon: 'warning',
        confirmButtonText: 'OK'
    })
}


function closeListing(uuid) {
    let value;
    $.ajax({
        url: host + '/api/get/close-listing',
        type: 'POST',
        data: {
            uuid: uuid,
        },
        async: false,
        success: function (data) {
            Swal.fire({
                title: data.title,
                text: data.message,
                icon: data.icon,
                confirmButtonText: 'OK'
            })

            displayListOfAuctions2();
        },
    });
    return value;
}