const request = require('request-promise')
const signale = require('signale')
const { runInContext } = require('vm')
const config = require('../settings/config.json')
const player = require('node-wav-player')
const ProxyManager = require('../utils/ProxyManager.js')
const tasks = require('../settings/tasks.json')
const proxy = ''

signale.config({
  displayTimestamp: true,
  displayFilename: true
})


class Target {
  constructor(task) {
    this.task = task
    this.paymentId = ''
    this.cartId = ''
    this.product = ''
    this.productImage = ''
    this.cart()
    this.proxy = ProxyManager.randomProxy('dc')
  }
  async cart() {
    if (this.task.instore == true) {
      request({
        method: 'POST',
        url: `https://carts.target.com/web_checkouts/v1/cart_items?field_groups=CART,CART_ITEMS,SUMMARY&key=${this.task.key}`,
        proxy,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Safari/537.36',
          'Cookie': this.task.cookies
        },
        gzip: true,
        json: true,
        body: {
          "cart_item": {tcin: this.task.prodId, quantity: 1, item_channel_id: "10" },
          "cart_type": "REGULAR",
          "channel_id": 10,
          "child_cart_item": {cart_item_type: "ESP", tcin: 53758309, quantity: 1},
          "fulfillment": {
            fulfillment_test_mode: "grocery_opu_team_member_test", 
            location_id: "2872", 
            ship_method: "STORE_PICKUP",
            type: "PICKUP"},
          "shopping_context": "DIGITAL"
        },
        resolveWithFullResponse: true
      }).then(res => {
        signale.success(this.task.prodId, 'Added To Cart')
        this.preCheckout()
        this.product = res.body.item_attributes.description
        this.productImage = res.body.item_attributes.image_path
        this.cartWebhook()
      }).catch(e => {
        if (e && e.response && e.response.statusCode == 424) {
          signale.error(this.task.name, 'Monitoring', this.task.prodId + ":", e.response.statusCode)
          setTimeout(() => {
            this.cart()
          }, config.cartDelay)
        } else if (e && e.response && e.response.statusCode == 429) {
          signale.error(e.response.statusCode, 'Rotating Proxy')
          this.proxy = ProxyManager.randomProxy('dc')
          this.cart()
        } else {
          signale.error('Error', e.response.statusCode)
          setTimeout(() => {
            this.cart()
          }, config.cartDelay)
        }
      })
    } else {
      request({
        method: 'POST',
        url: `https://carts.target.com/web_checkouts/v1/cart_items?field_groups=CART,CART_ITEMS,SUMMARY&key=${this.task.key}`,
        proxy,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Safari/537.36',
          'Cookie': this.task.cookies
        },
        gzip: true,
        json: true,
        body: {
          "cart_item": {tcin: this.task.prodId, quantity: 1, item_channel_id: "10" },
          "cart_type": "REGULAR",
          "channel_id": 10,
          "child_cart_item": {cart_item_type: "ESP", tcin: 53758309, quantity: 1},
          "fulfillment": { fulfillment_test_mode: "grocery_opu_team_member_test"},
          "shopping_context": "DIGITAL"
        },
        resolveWithFullResponse: true
      }).then(res => {
        signale.success(this.task.prodId, 'Added To Cart')
        this.preCheckout()
        this.product = res.body.item_attributes.description
        this.productImage = res.body.item_attributes.image_path
        this.cartWebhook()
      }).catch(e => {
        if (e && e.response && e.response.statusCode == 424) {
          signale.error(this.task.name,'Monitoring', this.task.prodId + ":", e.response.statusCode)
          setTimeout(() => {
            this.cart()
          }, config.cartDelay)
        } else if (e && e.response && e.response.statusCode == 429) {
          signale.error(e.response.statusCode, 'Rotating Proxy')
          this.proxy = ProxyManager.randomProxy('dc')
          console.log(this.proxy)
          this.cart()
        } else {
          signale.error('Error', e.response.statusCode)
          setTimeout(() => {
            this.cart()
          }, config.cartDelay)
        }
      })
    }
  }
  cartWebhook() {
    request({
      method: 'POST',
      url: config.webhook,
      json: true,
      body: {
        "embeds": [
          {
            "title": "Cart successful :white_check_mark:",
            "description": this.product,
            "thumbnail": {
              "url": this.productImage
            },
            "color": 7506394,
            "author": {
              "name": "Target Bot",
              "icon_url": "https://cdn.discordapp.com/attachments/549494974031331382/758195546673774602/target-logo-transparent.png"
            }
          }
        ]
      }
    })
  }
  preCheckout() {
    request({
      method: 'POST',
      url: `https://carts.target.com/web_checkouts/v1/pre_checkout?field_groups=ADDRESSES%2CCART%2CCART_ITEMS%2CDELIVERY_WINDOWS%2CPAYMENT_INSTRUCTIONS%2CPICKUP_INSTRUCTIONS%2CPROMOTION_CODES%2CSUMMARY&key=${this.task.key}`,
      proxy,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Safari/537.36',
        'Cookie': this.task.cookies
      },
      gzip: true,
      json: true,
      body: {
        "cart_type": "REGULAR"
      },
      resolveWithFullResponse: true
    }).then(res => {
      if (res.body.summary.total_product_amount > 0) {
        this.cartId = res.body.cart_id
        this.paymentId = res.body.payment_instructions[0].payment_instruction_id
        signale.success('Done with Precheckout')
        if (this.task.giftCard == true) {
          this.giftCard()
        } else {
          this.card()
        }
      } else {
        signale.error('No Product In Cart Retrying')
        setTimeout(() => {
          this.cart()
        }, config.cartDelay)
      }
    }).catch(e => {
      signale.error(e.response.statusCode + ' Invalid Cookies')
      this.preCheckout()
    })
  }
  giftCard() {
    request({
      method: 'POST',
      url: `https://carts.target.com/checkout_payments/v1/payment_instructions/?key=${this.task.key}`,
      proxy,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Safari/537.36',
        'Cookie': this.task.cookies,
        'x-application-name': "web"
      },
      gzip: true,
      json: true,
      body: {
        "cart_id": this.cartId,
        "payment_type": "TARGETGIFTCARD",
        "wallet_card_id": this.task.giftCardId,
        "wallet_mode": "POST"
      }
    }).then(res => {
      signale.success('Added Gift Card')
      this.card()
    }).catch(e => {
      if (e && e.response && e.response.statusCode == 400) {
        signale.success('Gift Card Already Added')
        this.card()
      } else {
        signale.error(e.response.statusCode, 'Error', e.response.body)
        this.giftCard()
      }
    })
  }  
  card() {
    request({
      method: 'PUT',
      url: `https://carts.target.com/checkout_payments/v1/payment_instructions/${this.paymentId}?key=${this.task.key}`,
      proxy,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Safari/537.36',
        'Cookie': this.task.cookies,
        'x-application-name': "web"
      },
      gzip: true,
      json: true,
      body: {
        "card_details": { "cvv": this.task.cvv },
        "cart_id": this.cartId,
        "payment_type": "CARD",
        "wallet_mode": "NONE"
      }
    }).then(res => {
      signale.success('Added Card')
      this.checkout()
    }).catch(e => {
      if (e && e.response && e.response.statusCode == 400 || 424) {
        signale.success('Card Already Added')
        this.checkout()
      } else {
        signale.error(e.response.statusCode, 'Error', e.response.body)
        this.card()
      }
    })
  }
  checkout() {
    request({
      method: 'POST',
      url: `https://carts.target.com/web_checkouts/v1/checkout?field_groups=ADDRESSES%2CCART%2CCART_ITEMS%2CDELIVERY_WINDOWS%2CPAYMENT_INSTRUCTIONS%2CPICKUP_INSTRUCTIONS%2CPROMOTION_CODES%2CSUMMARY&key=${this.task.key}`,
      proxy,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Safari/537.36',
        'Cookie': this.task.cookies,
        'x-application-name': "web"
      },
      gzip: true,
      json: true,
      body: {
        "cart_type": "REGULAR",
        "channel_id": "10"
      },
      resolveWithFullResponse: true
    }).then(res => {
      player.play({
        path: './ding.wav'
      }).catch((error) => {
        console.error(error)
      })
      signale.success('Checked Out Successfully')
      sendWebhook()
      this.cart()
    }).catch(e => {
      if (e && e.response && e.response.statusCode == 400) {
        this.card()
      } else if (e && e.response && e.response.statusCode == 424) {
        signale.error(e.response.statusCode + ' Checkout Failed To Process (Check CVV)')
        setTimeout(() => {
          this.checkout()
        }, config.cartDelay)
      } else {
        signale.error(e.response.statusCode, 'Error')
      }
    })
  }
  sendWebhook() {
    request({
      method: 'POST',
      url: config.webhook,
      json: true,
      body: {
        "embeds": [
          {
            "title": "Checkout Successful :white_check_mark:",
            "description": this.product,
            "thumbnail": {
              "url": this.productImage
            },
            "color": 7506394,
            "author": {
              "name": "Target Bot",
              "icon_url": "https://cdn.discordapp.com/attachments/549494974031331382/758195546673774602/target-logo-transparent.png"
            }
          }
        ]
      }
    })
  }
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

module.exports = {
  startTasks: async () => {
    const delay = config.cartDelay/tasks.length
    if (tasks.length != 0) {
      for (let task of tasks) {
        new Target(task);
        await sleep(delay)
      }
    } else {
      signale.error('No Tasks Available')
    }
  }
}
