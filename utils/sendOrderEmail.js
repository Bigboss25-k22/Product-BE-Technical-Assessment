const nodemailer = require('nodemailer');
require('dotenv').config();

async function sendOrderConfirmationEmail(to, order, orderItems = []) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASSWORD }
    });

    // Tạo bảng HTML sản phẩm đã đặt
    let itemsHtml = '';
    if (orderItems.length > 0) {
        itemsHtml = `
        <table border="1" cellpadding="5" cellspacing="0" style="border-collapse:collapse;">
            <thead>
                <tr>
                    <th>Sản phẩm</th>
                    <th>Số lượng</th>
                    <th>Giá</th>
                </tr>
            </thead>
            <tbody>
                ${orderItems.map(item => `
                    <tr>
                        <td>${item.product_name || item.product_item_id}</td>
                        <td>${item.qty}</td>
                        <td>${item.price}₫</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
        `;
    }

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject: 'Xác nhận đơn hàng của bạn',
        html: `
            <h2>Cảm ơn bạn đã đặt hàng tại Shop!</h2>
            <p>Mã đơn hàng: <b>${order.id}</b></p>
            <p>Ngày đặt: ${order.order_date ? new Date(order.order_date).toLocaleString() : ''}</p>
            <h3>Chi tiết đơn hàng:</h3>
            ${itemsHtml}
            <p><b>Tổng tiền:</b> ${order.order_total}₫</p>
            <p>Chúng tôi sẽ liên hệ với bạn để xác nhận và giao hàng sớm nhất.</p>
            <hr>
            <p style="font-size:12px;color:#888;">Đây là email tự động, vui lòng không trả lời email này.</p>
        `
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) console.error('Error sending email:', error);
        else console.log('Order confirmation email sent:', info.response);
    });
}
module.exports = sendOrderConfirmationEmail;