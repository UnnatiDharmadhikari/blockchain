App = {
    
    loading:false,

    render: async () => {
        if(App.loading) {
            return;
        }
        $('#account').html(App.account);
        await App.listAllTenders();
        await App.listMyBids();
    },

    listAllTenders: async () => {
        const tenderCount = await App.TenderAuction.tenderCount();
        for(i = 1; i <= tenderCount; i++) {
            const tender = await App.TenderAuction.tenders(i);
            const tenderTemplate = `<tr style="text-align:center">
                                        <td>${tender[0]}</td>
                                        <td>${tender[1]}</td>
                                        <td>${tender[3]}</td>
                                        <td><button onclick="popup('${tender[0]}')" class="btn btn-success">Invest</button></td>
                                    <tr>`;
            
            const tenderPopupTemplate = `<div class="abc" id="tenderId${tender[0]}">
				
                                            <br><br><br>

                                            <div style="margin-top:20px; width: 550px;" class="container card w3-section">
                                            <button type="button" onclick="div_hide('${tender[0]}')" class="btn-close" style="margin-left: 500px;" data-bs-dismiss="modal" aria-label="Close"></button>

                                                <span><b>Start-Up ID: </b>${tender[0]}</span>
                                                <span><b>Start-Up Name: </b>${tender[1]}</span>
                                                <span><b>Quantity: </b>${tender[3]}</span>
                                                <span><b>Start-Up Address: </b>${tender[4]}</span>

                                                <hr>

                                                <center style="margin-bottom:10px;">
                                                    <input class="form-control" type="number" style="margin-bottom:10px;" id="ppi${tender[0]}" placeholder="Price per Item">
                                                    <button class="w3-button w3-green" style="width:150px;" onclick="App.makeBid(${tender[0]});">Make a Investment</button>
                                                </center>

                                            </div>
                                            
                                        </div>`

            $("#allTenders").append(tenderTemplate);
            $("#tenderPopup").append(tenderPopupTemplate);          
        }
    },

    listMyBids: async () => {
        const bidCount = await App.TenderAuction.bidCount();
        for(i = 1; i <= bidCount; i++) {
            const bid = await App.TenderAuction.bids(i);
            if(bid[4] == App.account) {
                const bidTemplate = `<tr style="text-align:center">
                                            <td>${bid[0]}</td>
                                            <td>${bid[2]}</td>
                                            <td>${bid[3]}</td>
                                            <td>
                                        </tr>`;
                $("#myBids").append(bidTemplate);
            }
        }
    },

    makeBid: async (id) => {
        App.setLoading(true);
        const bid = $("#ppi"+id).val();
        App.TenderAuction.createBid(id, bid, {from:App.account});
    },

    setLoading: (boolean) => {
        App.loading = boolean;
        const loader = $('#loading');
        const content = $('#content');
        if(boolean) {
            loader.show();
            content.hide();
        }else {
            loader.hide();
            content.show();
        }
    }

}

function showAllTenders() {
    $("#bidList").hide();
    $("#listAllTenders").show();
}

function showBids() {
    $("#bidList").show();
    $("#listAllTenders").hide();
}

function popup(id) {
    $("#exampleModal11").modal('toggle');
    $("#tenderId"+id).show();
}

function div_hide(id) {
    $("#tenderId"+id).hide();
}