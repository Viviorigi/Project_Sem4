USE master;
GO
USE sem4;
GO

INSERT INTO Categories (Active, CategoryName, Slug, CreatedAt) VALUES
(1, 'Apple', 'apple', GETDATE()),
(1, 'Xiaomi', 'xiaomi', GETDATE()),
(1, 'Oppo', 'oppo', GETDATE()),
(1, 'Vivo', 'vivo', GETDATE()),
(1, 'Realme', 'realme', GETDATE());

INSERT INTO Products (Price, Active, SalePrice, Image, ProductName, Slug, Description, CategoryId, CreatedAt) VALUES
(4950000, 1, 0, 'iphone_11.jpg', N'Điện thoại iPhone 11 cũ (Chính hãng, Rẻ hơn 36%)', 'iphone_11', N'<table>
			<tbody>
				<tr>
					<td>Màn hình:</td>
					<td>Liquid Retina IPS LCD, 625 nits (typ)<br>
6.1 inches, HD+ (828 x 1792 pixels), tỷ lệ 19.5:9<br>
Kính chống xước</td>
				</tr>
				<tr>
					<td>Hệ điều hành:</td>
					<td>iOS 13 (gốc)<br>
Được lên iOS 18</td>
				</tr>
				<tr>
					<td>Camera sau:</td>
					<td>12 MP, f/1.8, 26mm (góc rộng), dual pixel PDAF, OIS<br>
12 MP, f/2.4, 120˚, 13mm (góc siêu rộng)<br>
Quay phim: 4K@24/30/60fps, 1080p@30/60/120/240fps, HDR, stereo sound rec.</td>
				</tr>
				<tr>
					<td>Camera trước:</td>
					<td>12 MP, f/2.2, 23mm (góc rộng), HDR<br>
SL 3D, (đo chiều sâu)<br>
Quay phim: 4K@24/30/60fps, 1080p@30/60/120fps, gyro-EIS</td>
				</tr>
				<tr>
					<td>CPU:</td>
					<td>Apple A13 Bionic (7 nm+)<br>
6 nhân (2x2.65 GHz + 4x1.8 GHz)<br>
GPU: Apple GPU (4-core graphics)</td>
				</tr>
				<tr>
					<td>RAM:</td>
					<td>4GB</td>
				</tr>
				<tr>
					<td>Bộ nhớ trong:</td>
					<td>64/128/256GB NVMe<br>
Thẻ nhớ: không</td>
				</tr>
				<tr>
					<td>Thẻ SIM:</td>
					<td>2 SIM hoặc 1 SIM, Nano-SIM hoặc E-SIM, 2 SIM (Nano-SIM, dual stand-by) bản Trung Quốc</td>
				</tr>
				<tr>
					<td>Dung lượng pin:</td>
					<td>Li-Ion 3110 mAh<br>
Sạc nhanh 18W, 50% pin trong 30ph (quảng cáo)<br>
USB Power Delivery 2.0<br>
Sạc không dây Qi</td>
				</tr>
				<tr>
					<td>Thiết kế:</td>
					<td>Thiết kế nguyên 2 mặt kính</td>
				</tr>
			</tbody>
		</table>', 1, GETDATE()),
(7350000, 1, 0, 'iphone_11promax.jpg', N'Điện thoại iPhone 11 Pro Max cũ (Chính hãng) - Giá Rẻ hơn 39%', 'iphone_11promax', N'<table>
			<tbody>
				<tr>
					<td>Màn hình:</td>
					<td>Super Retina XDR OLED, HDR10, Dolby Vision, 800 nits (HBM), 1200 nits (tối đa)<br>
6.5 inches, 1242 x 2688 pixels, 19.5:9 ratio<br>
Scratch-resistant glass</td>
				</tr>
				<tr>
					<td>Hệ điều hành:</td>
					<td>iOS 13, có thể nâng cấp lên iOS 17</td>
				</tr>
				<tr>
					<td>Camera sau:</td>
					<td>12 MP, f/1.8, 26mm (góc rộng), dual pixel PDAF, OIS<br>
12 MP, f/2.0, 52mm (tele), PDAF, OIS, zoom quang 2x<br>
12 MP, f/2.4, 120˚, 13mm (góc siêu rộng)<br>
Quay phim: 4K@24/30/60fps, 1080p@30/60/120/240fps, HDR, stereo sound rec.</td>
				</tr>
				<tr>
					<td>Camera trước:</td>
					<td>12 MP, f/2.2, 23mm (góc rộng), HDR<br>
SL 3D (độ sâu, nhận diện Face ID)<br>
Quay phim: 4K@24/30/60fps, 1080p@30/60/120fps, gyro-EIS</td>
				</tr>
				<tr>
					<td>CPU:</td>
					<td>Apple A13 Bionic (7 nm+)<br>
6 nhân (2x2.65 GHz + 4x1.8 GHz)<br>
GPU: Apple GPU (4 nhân)</td>
				</tr>
				<tr>
					<td>RAM:</td>
					<td>4GB</td>
				</tr>
				<tr>
					<td>Bộ nhớ trong:</td>
					<td>64GB-512GB, NVMe</td>
				</tr>
				<tr>
					<td>Thẻ SIM:</td>
					<td>Nano SIM, eSIM<br>
1 SIM hoặc 2 SIM (tuỳ từng phiên bản)</td>
				</tr>
				<tr>
					<td>Dung lượng pin:</td>
					<td>Li-Ion 3969 mAh<br>
Sạc nhanh PD2.0, 50% trong 30ph (QC)<br>
Sạc không dây (Qi)</td>
				</tr>
				<tr>
					<td>Thiết kế:</td>
					<td>Khung thép bo cong<br>
Kính trước Scratch-resistant glass<br>
Kính sau Corning-made glass<br>
Chuẩn kháng nước, bụi IP68</td>
				</tr>
			</tbody>
		</table>', 1, GETDATE()),
(10650000, 1, 0, 'iphone_12promax.jpg', N'Điện thoại iPhone 12 Pro Max cũ', 'iphone_12promax', N'<table>
			<tbody>
				<tr>
					<td>Màn hình:</td>
					<td>Super Retina XDR OLED, HDR10, Dolby Vision, 800 nits (HBM), 1200 nits (peak)<br>
6.7 inches (1284 x 2778 pixels), tỷ lệ 19.5:9<br>
Kính Ceramic chống xước<br>
True-tone</td>
				</tr>
				<tr>
					<td>Hệ điều hành:</td>
					<td>iOS 14</td>
				</tr>
				<tr>
					<td>Camera sau:</td>
					<td>12 MP, f/1.6, 26mm (góc rộng), dual pixel PDAF, sensor-shift OIS<br>
12 MP, f/2.2, 65mm (chân dung), PDAF, OIS, 2.5x optical zoom<br>
12 MP, f/2.4, 13mm, 120˚ (góc siêu rộng)<br>
TOF 3D LiDAR scanner (đo độ sâu)<br>
Quay phim: 4K@24/30/60fps, 1080p@30/60/120/240fps, 10‑bit HDR, Dolby Vision HDR (up to 60fps)</td>
				</tr>
				<tr>
					<td>Camera trước:</td>
					<td>12 MP, f/2.2, 23mm (góc rộng)<br>
Quay phim: 4K@24/30/60fps, 1080p@30/60/120fps, gyro-EIS</td>
				</tr>
				<tr>
					<td>CPU:</td>
					<td>Apple A14 Bionic (5 nm)<br>
6 nhân (2x3.1 GHz Firestorm + 4x1.8 GHz Icestorm)<br>
GPU: Apple GPU (4 nhân đồ họa)</td>
				</tr>
				<tr>
					<td>RAM:</td>
					<td>6GB</td>
				</tr>
				<tr>
					<td>Bộ nhớ trong:</td>
					<td>128-256-512GB</td>
				</tr>
				<tr>
					<td>Thẻ SIM:</td>
					<td>2 SIM</td>
				</tr>
				<tr>
					<td>Dung lượng pin:</td>
					<td>Li-Ion 3687 mAh<br>
Sạc nhanh PD2.0, 50% trong 30ph (quảng cáo)<br>
Sạc không dây Qi2 15W (iOS 17.4)<br>
MagSafe không dây 15W</td>
				</tr>
				<tr>
					<td>Thiết kế:</td>
					<td>Thiết kế 2 mặt kính, khung thép không gỉ</td>
				</tr>
			</tbody>
		</table>', 1, GETDATE()),
(12450000, 1, 0, 'iphone_13promax.jpg', N'Điện thoại iPhone 13 Pro Max cũ (Chính hãng - Giảm giá 30%)', 'iphone_13promax', N'<table>
			<tbody>
				<tr>
					<td>Màn hình:</td>
					<td>Super Retina XDR OLED, 120Hz, HDR10, Dolby Vision, 1000 nits (HBM), 1200 nits (tối đa)<br>
6.7 inches, 1284 x 2778 pixels<br>
Ceramic Shield glass</td>
				</tr>
				<tr>
					<td>Hệ điều hành:</td>
					<td>iOS 15, được nâng lên iOS 18</td>
				</tr>
				<tr>
					<td>Camera sau:</td>
					<td>12 MP, f/1.5 (góc rộng) dual pixel PDAF, sensor-shift OIS<br>
12 MP, f/1.8, 120˚ (góc siêu rộng), PDAF<br>
12 MP, f/2.8 (tele), PDAF, OIS, 3x optical zoom<br>
TOF 3D LiDAR scanner (đo chiều sâu)<br>
Quay phim: 4K@24/30/60fps, 1080p@30/60/120/240fps, 10-bit HDR, Dolby Vision HDR (up to 60fps), ProRes, Cinematic mode (1080p@30fps), stereo sound rec.</td>
				</tr>
				<tr>
					<td>Camera trước:</td>
					<td>12 MP, f/2.2 (góc rộng)<br>
SL 3D (cảm biến độ sâu/sinh trắc học)<br>
Quay phim: 4K@24/25/30/60fps, 1080p@30/60/120fps, gyro-EIS</td>
				</tr>
				<tr>
					<td>CPU:</td>
					<td>Apple A15 Bionic (5 nm)<br>
6 nhân (2x3.23 GHz &amp; 4x1.82 GHz)<br>
GPU: Apple GPU (5 nhân)</td>
				</tr>
				<tr>
					<td>RAM:</td>
					<td>6GB</td>
				</tr>
				<tr>
					<td>Bộ nhớ trong:</td>
					<td>128GB-1TB, NVMe</td>
				</tr>
				<tr>
					<td>Thẻ SIM:</td>
					<td>1 hoặc 2 SIM (tùy theo thị trường)<br>
Nano-SIM, eSIM</td>
				</tr>
				<tr>
					<td>Dung lượng pin:</td>
					<td>Li-Ion 4352 mAh<br>
Sạc nhanh  PD2.0, 50% trong 30 phút (QC)<br>
Sạc không dây: MagSafe 15W, Qi 7.5W</td>
				</tr>
				<tr>
					<td>Thiết kế:</td>
					<td>Khung thép vuông vức<br>
Kính sau Corning-made glass<br>
Kính trước Ceramic Shield glass<br>
Kháng nước, bụi IP68</td>
				</tr>
			</tbody>
		</table>', 1, GETDATE()),
(12850000, 1, 0, 'iphone_15.jpg', N'Điện thoại iPhone 15 cũ (Chính hãng - Đẹp như mới)', 'iphone_15', N'<table>
			<tbody>
				<tr>
					<td>Màn hình:</td>
					<td>Super Retina XDR OLED, HDR10, Dolby Vision, 1000 nits (HBM), 2000 nits (tối đa)<br>
6.1 inches, 1.5K (1179 x 2556 pixels), tỷ lệ 19.5:9<br>
Mật độ điểm ảnh ~461 ppi<br>
Ceramic Shield glass</td>
				</tr>
				<tr>
					<td>Hệ điều hành:</td>
					<td>iOS 17<br>
Được lên iOS 18</td>
				</tr>
				<tr>
					<td>Camera sau:</td>
					<td>48 MP, f/1.6, 26mm (góc rộng), dual pixel PDAF, sensor-shift OIS<br>
12 MP, f/2.4, 13mm, 120˚ (góc siêu rộng)<br>
Quay phim: 4K@24/25/30/60fps, 1080p@25/30/60/120/240fps, HDR, Dolby Vision HDR (up to 60fps), Cinematic mode (4K@30fps), stereo sound rec.</td>
				</tr>
				<tr>
					<td>Camera trước:</td>
					<td>12 MP, f/1.9, 23mm (góc rộng), PDAF<br>
SL 3D (độ sâu/sinh trắc học)<br>
HDR, Cinematic mode (4K@30fps)<br>
Quay phim: 4K@24/25/30/60fps, 1080p@25/30/60/120fps, gyro-EIS</td>
				</tr>
				<tr>
					<td>CPU:</td>
					<td>Apple A16 Bionic (4 nm)<br>
6 nhân (2x3.46 GHz &amp; 4x2.02 GHz)<br>
GPU: Apple GPU (5 lõi đồ họa)</td>
				</tr>
				<tr>
					<td>RAM:</td>
					<td>6GB</td>
				</tr>
				<tr>
					<td>Bộ nhớ trong:</td>
					<td>128-512GB, NVMe</td>
				</tr>
				<tr>
					<td>Thẻ SIM:</td>
					<td>Nano SIM và eSIM (Quốc tế)<br>
Chỉ eSIM (bản Mỹ)<br>
2 SIM,Nano SIM (Trung Quốc)</td>
				</tr>
				<tr>
					<td>Dung lượng pin:</td>
					<td>Li-Ion 3349 mAh<br>
Sạc nhanh &gt; 20W, 50% trong 30 ph (QC)<br>
Sạc không dây (MagSafe) 15W<br>
Sạc không dây (Qi2) 15W<br>
Sạc ngược 4.5W (dây)</td>
				</tr>
				<tr>
					<td>Thiết kế:</td>
					<td>Khung nhôm vuông vức<br>
Kính sau Corning-made<br>
Kính trước Ceramic Shield<br>
Thiết kế màn hình Dynamic Island<br>
Kháng nước, bụi IP68</td>
				</tr>
			</tbody>
		</table>', 1, GETDATE()),
(20950000, 1, 0, 'iphone_15promax.jpg', N'Điện thoại iPhone 15 Pro Max Cũ (99.9% - Có trả góp 0%)', 'iphone_15promax', N'<table>
			<tbody>
				<tr>
					<td>Màn hình:</td>
					<td>LTPO Super Retina XDR OLED, 120Hz, HDR10, Dolby Vision, 1000 nits (typ), 2000 nits (HBM)<br>
6.7 inches, 1.5K+ (1290 x 2796 pixels), tỷ lệ 19.5:9<br>
Ceramic Shield glass<br>
Always-on Display</td>
				</tr>
				<tr>
					<td>Hệ điều hành:</td>
					<td>iOS 17<br>
được lên iOS 18</td>
				</tr>
				<tr>
					<td>Camera sau:</td>
					<td>48 MP, f/1.8, 24mm (góc rộng), dual pixel PDAF, sensor-shift OIS<br>
12 MP, f/2.8, 120mm (tele kính tiềm vọng), dual pixel PDAF, 3D sensor‑shift OIS, zoom quang 5x<br>
12 MP, f/2.2, 13mm, 120˚ (góc siêu rộng), dual pixel PDAF<br>
TOF 3D LiDAR scanner (đo độ sâu)<br>
Quay phim: 4K@24/25/30/60fps, 1080p@25/30/60/120/240fps, 10-bit HDR, Dolby Vision HDR (up to 60fps), ProRes, Cinematic mode (4K@24/30fps), 3D (spatial) video, stereo sound rec.</td>
				</tr>
				<tr>
					<td>Camera trước:</td>
					<td>12 MP, f/1.9, 23mm (góc rộng), PDAF, OIS<br>
SL 3D (độ sâu/cảm biến sinh trắc học)<br>
HDR, Cinematic mode (4K@24/30fps)<br>
Quay phim: 4K@24/25/30/60fps, 1080p@25/30/60/120fps, gyro-EIS</td>
				</tr>
				<tr>
					<td>CPU:</td>
					<td>Apple A17 Pro (3 nm)<br>
6 nhân (2x3.78 GHz &amp; 4x2.11 GHz)<br>
GPU: Apple GPU (6-lõi đồ họa)</td>
				</tr>
				<tr>
					<td>RAM:</td>
					<td>8GB</td>
				</tr>
				<tr>
					<td>Bộ nhớ trong:</td>
					<td>256-512GB, 1TB, NVMe</td>
				</tr>
				<tr>
					<td>Thẻ SIM:</td>
					<td>Nano SIM và eSIM (Quốc tế)<br>
Chỉ eSIM (bản Mỹ)<br>
2 SIM,Nano SIM (Trung Quốc)</td>
				</tr>
				<tr>
					<td>Dung lượng pin:</td>
					<td>Li-Ion 4441 mAh<br>
Sạc nhanh có dây 50% trong 30 ph (QC)<br>
Sạc không dây (MagSafe) 15W<br>
Sạc không dây (Qi2) 15W<br>
Sạc ngược 4.5W (dây)</td>
				</tr>
				<tr>
					<td>Thiết kế:</td>
					<td>Màn hình tràn viền với Dynamic Island<br>
Khung viền Titan (grade 5)<br>
Mặt lưng kính Corning-made<br>
Kính trước Ceramic Shield<br>
Kháng nước, bụi IP68</td>
				</tr>
			</tbody>
		</table>', 1, GETDATE()),
(6650000, 1, 0, 'xiaomi_13.jpg', N'Điện thoại Xiaomi 13 cũ', 'xiaomi_13', N'<table>
			<tbody>
				<tr>
					<td>Màn hình:</td>
					<td>AMOLED, 120Hz, Dolby Vision, HDR10+, 1200 nits (HBM), 1900 nits (tối đa)<br>
6.36 inches, Full HD+ (1080 x 2400 pixels), tỷ lệ 20:9</td>
				</tr>
				<tr>
					<td>Hệ điều hành:</td>
					<td>Android 13, MIUI 14</td>
				</tr>
				<tr>
					<td>Camera sau:</td>
					<td>50 MP, f/1.8, 23mm (góc rộng), PDAF, OIS<br>
10 MP, f/2.0 75mm (tele), 1/3.94", 1.0µm, PDAF, OIS, 3.2x optical zoom<br>
12 MP, f/2.2, 15mm, 120˚ (góc siêu rộng)<br>
Quay phim: 8K@24fps (HDR), 4K@24/30/60fps (HDR10+), 1080p@30/120/240/960fps, 1080p@1920fps, gyro-EIS</td>
				</tr>
				<tr>
					<td>Camera trước:</td>
					<td>32 MP,  f/2.0, 20mm (góc rộng)<br>
Quay phim: 1080p@30fps</td>
				</tr>
				<tr>
					<td>CPU:</td>
					<td>Qualcomm SM8550 Snapdragon 8 Gen 2 (4 nm)<br>
8 nhân (1x3.2 GHz &amp; 2x2.8 GHz &amp; 2x2.8 GHz &amp; 3x2.0 GHz)<br>
GPU: Adreno 740</td>
				</tr>
				<tr>
					<td>RAM:</td>
					<td>8-12GB, LPDDR5x</td>
				</tr>
				<tr>
					<td>Bộ nhớ trong:</td>
					<td>128GB (UFS 3.1 - 2.2GB/s)<br>
256GB/512GB (UFS 4.0 - 3.5GB/s)</td>
				</tr>
				<tr>
					<td>Thẻ SIM:</td>
					<td>2SIM, NanoSIM</td>
				</tr>
				<tr>
					<td>Dung lượng pin:</td>
					<td>Li-Po 4500 mAh<br>
Sạc nhanh 67W, PD3.0, QC4, 100% trong 38ph (quảng cáo)<br>
Sạc nhanh không dây 50W, 100% trong 48ph (quảng cáo)<br>
Sạc ngược không dây 10W</td>
				</tr>
				<tr>
					<td>Thiết kế:</td>
					<td>Khung kim loại + hai mặt kính<br>
Thiết kế vuông vức<br>
IP68 (có thể kháng nước 1,5m trong 30 phút)</td>
				</tr>
			</tbody>
		</table>', 2, GETDATE()),
(13850000, 1, 0, 'xiaomi_15tpro.jpg', N'Điện thoại Xiaomi 15T Pro Chính hãng (Dimensity 9400 Plus - Pin 5500 mAh)', 'xiaomi_15tpro', N'<table>
			<tbody>
				<tr>
					<td>Màn hình:</td>
					<td>AMOLED, 68 tỷ màu, 144Hz, 3840Hz PWM, Dolby Vision, HDR10+, 3200 nits (peak)<br>
6.83 inches, 1.5K (1220 x 2712 pixels)<br>
Tỷ lệ 20:9, mật độ điểm ảnh ~435 ppi<br>
Corning Gorilla Glass 7i</td>
				</tr>
				<tr>
					<td>Hệ điều hành:</td>
					<td>Android 16, HyperOS 3</td>
				</tr>
				<tr>
					<td>Camera sau:</td>
					<td>50 MP, f/1.6, 23mm (góc rộng), 1/1.31", 1.2µm, PDAF, OIS<br>
50 MP, f/3.0, 115mm (tele tiềm vọng), PDAF, OIS, zoom quang 5x<br>
12 MP, f/2.2, 15mm, 120˚ (góc siêu rộng), 1/3.06", 1.12µm<br>
Quay phim: 8K@30fps, 4K@30/60/120fps, 1080p@30/60/120/240fps, gyro-EIS, 10-bit Rec. 2020, HDR10+</td>
				</tr>
				<tr>
					<td>Camera trước:</td>
					<td>32 MP, f/2.2, 21mm (góc rộng), 1/3.44", 0.64µm, HDR<br>
Quay phim: 4K@30fps, 1080p@30/60fps, HDR10+</td>
				</tr>
				<tr>
					<td>CPU:</td>
					<td>MediaTek Dimensity 9400 Plus (4 nm)<br>
8 nhân (1x3.63 GHz &amp; 3x3.3 GHz &amp; 4x2.4 GHz)<br>
GPU: Immortalis-G925</td>
				</tr>
				<tr>
					<td>RAM:</td>
					<td>12GB, LPDDR5X</td>
				</tr>
				<tr>
					<td>Bộ nhớ trong:</td>
					<td>256GB-1TB, UFS 4.1</td>
				</tr>
				<tr>
					<td>Thẻ SIM:</td>
					<td>2 SIM Nano + 2 eSIM<br>
Hoặc 2 SIM Nano</td>
				</tr>
				<tr>
					<td>Dung lượng pin:</td>
					<td>5500 mAh<br>
Sạc nhanh 90W, PD3.0, QC4<br>
Sạc không dây 50W</td>
				</tr>
				<tr>
					<td>Thiết kế:</td>
					<td>Khung nhôm phẳng<br>
Mặt lưng sợi thủy tinh phẳng<br>
Kháng nước, bụi IP68<br>
Cảm biến vân tay quang học dưới màn hình</td>
				</tr>
			</tbody>
		</table>', 2, GETDATE()),
(16950000, 1, 0, 'xiaomi_17.jpg', N'Điện thoại Xiaomi 17 (Snapdragon 8 Elite Gen 5 - Pin 7000mAh)', 'xiaomi_17', N'<table>
			<tbody>
				<tr>
					<td>Màn hình:</td>
					<td>LTPO AMOLED, 68 tỷ màu, 120Hz, 2160Hz PWM, Dolby Vision, HDR Vivid, HDR10+, 3500 nits (peak)<br>
6.3 inches, 1.5K (1220 x 2656 pixels)<br>
Tỷ lệ 19.5:9, mật độ điểm ảnh ~464 ppi</td>
				</tr>
				<tr>
					<td>Hệ điều hành:</td>
					<td>Android 16, HyperOS 3.0</td>
				</tr>
				<tr>
					<td>Camera sau:</td>
					<td>50 MP, f/1.7, 23mm (góc rộng), 1/1.31", 1.2µm, dual pixel PDAF, OIS<br>
50 MP, f/2.0, 60mm (tele),  1/2.76", 0.64µm, PDAF (10cm - ∞), OIS, zoom quang 2.6x<br>
50 MP, f/2.4, 17mm, 102˚ (góc siêu rộng), 1/2.76", 0.64µm<br>
Quay phim: 8K@30fps (HDR), 4K@30/60fps (HDR10+, 10-bit Dolby Vision HDR, 10-bit LOG), 1080p@30/60/120/240/960fps, 720p@1920fps, gyro-EIS</td>
				</tr>
				<tr>
					<td>Camera trước:</td>
					<td>50 MP, f/2.2, 21mm (góc rộng), PDAF, HDR, panorama<br>
Quay phim: 4K@30/60fps, 1080p@30/60fps, HDR10+, gyro-EIS</td>
				</tr>
				<tr>
					<td>CPU:</td>
					<td>Qualcomm Snapdragon 8 Elite Gen 5 (3 nm)<br>
8 nhân (2x4.6 GHz &amp; 6x3.62 GHz)<br>
GPU: Adreno 840</td>
				</tr>
				<tr>
					<td>RAM:</td>
					<td>12-16GB, LPDDR5X</td>
				</tr>
				<tr>
					<td>Bộ nhớ trong:</td>
					<td>256-512GB, UFS 4.1</td>
				</tr>
				<tr>
					<td>Thẻ SIM:</td>
					<td>2 SIM Nano<br>
Hoặc 2 SIM Nano + 2 eSIM</td>
				</tr>
				<tr>
					<td>Dung lượng pin:</td>
					<td>Si/C Li-Ion 7000 mAh<br>
Sạc nhanh 100W, PD3.0, QC3+, 100W PPS<br>
Sạc không dây 50W<br>
Sạc ngược không dây 22.5W</td>
				</tr>
				<tr>
					<td>Thiết kế:</td>
					<td>Khung nhôm phẳng<br>
2 mặt kính Dragon Crystal phẳng<br>
Kháng nước, bụi IP68<br>
Cảm biến vân tay siêu âm dưới màn hình</td>
				</tr>
			</tbody>
		</table>', 2, GETDATE()),
(19450000, 1, 0, 'xiaomi_17pro.jpg', N'Điện thoại Xiaomi 17 Pro 5G (Snapdragon 8 Elite Gen 5 - Pin 7000mAh)', 'xiaomi_17pro', N'<table>
			<tbody>
				<tr>
					<td>Màn hình:</td>
					<td>LTPO AMOLED, 68 tỷ màu, 2160Hz PWM, 120Hz, Dolby Vision, HDR Vivid, HDR10+, 3500 nits (peak)<br>
6.3 inches, 1.5K (1220 x 2656 pixels)<br>
Tỷ lệ 19.5:9, mật độ điểm ảnh ~464 ppi<br>
Kính Xiaomi Dragon Crystal<br>
Màn phụ (sau): LTPO AMOLED, 120Hz, Dolby Vision, HDR Vivid, HDR10+, 3500 nits (peak)<br>
2.7 inches, 572 x 904 pixels</td>
				</tr>
				<tr>
					<td>Hệ điều hành:</td>
					<td>Android 16, HyperOS 3</td>
				</tr>
				<tr>
					<td>Camera sau:</td>
					<td>50 MP, f/1.7, 23mm (góc rộng), 1/1.28", 1.22µm, dual pixel PDAF, OIS<br>
50 MP, f/3.0, 115mm (tele tiềm vọng), PDAF (20cm - ∞), OIS, zoom quang 5x<br>
50 MP, f/2.4, 17mm, 102˚ (góc siêu rộng), 1/2.76", 0.64µm<br>
Quay phim: 8K@30fps (HDR), 4K@30/60/120fps (HDR10+, 10-bit Dolby Vision HDR, 10-bit LOG), 1080p@30/60/120/240/960fps, 720p@1920fps, gyro-EIS</td>
				</tr>
				<tr>
					<td>Camera trước:</td>
					<td>50 MP, f/2.2, 21mm (góc rộng), PDAF, HDR, panorama<br>
Quay phim: 4K@30/60fps, 1080p@30/60fps, HDR10+, gyro-EIS</td>
				</tr>
				<tr>
					<td>CPU:</td>
					<td>Qualcomm Snapdragon 8 Elite Gen 5 (3 nm)<br>
8 nhân (2x4.6 GHz &amp; 6x3.62 GHz)<br>
GPU: Adreno 840</td>
				</tr>
				<tr>
					<td>RAM:</td>
					<td>12-16GB, LPDDR5X</td>
				</tr>
				<tr>
					<td>Bộ nhớ trong:</td>
					<td>256GB-1TB, UFS 4.1</td>
				</tr>
				<tr>
					<td>Thẻ SIM:</td>
					<td>2 SIM Nano<br>
Hoặc 2 SIM Nano + 2 eSIM</td>
				</tr>
				<tr>
					<td>Dung lượng pin:</td>
					<td>Si/C Li-Ion 6300 mAh<br>
Sạc siêu nhanh 100W, PD3.0, QC3+, 100W PPS<br>
Sạc không dây 50W<br>
Sạc ngược không dây 22.5W</td>
				</tr>
				<tr>
					<td>Thiết kế:</td>
					<td>Khung nhôm phẳng<br>
2 mặt kính Dragon Crystal phẳng<br>
Kháng nước, bụi IP68<br>
Cảm biến vân tay siêu âm dưới màn hình</td>
				</tr>
			</tbody>
		</table>', 2, GETDATE()),
(23450000, 1, 0, 'xiaomi_17promax.jpg', N'Điện thoại Xiaomi 17 Pro Max (Snapdragon 8 Elite Gen 5 - Pin 7500mAh)', 'xiaomi_17promax', N'<table>
			<tbody>
				<tr>
					<td>Màn hình:</td>
					<td>LTPO AMOLED, 68 tỷ màu, 120Hz, 2160Hz PWM, Dolby Vision, HDR Vivid, HDR10+, 3500 nits (peak)<br>
6.9 inches, 1.5K (1200 x 2608 pixels)<br>
Tỷ lệ 19.5:9, mật độ điểm ảnh ~416 ppi<br>
Kính Xiaomi Dragon Crystal 3<br>
Màn phụ (sau): LTPO AMOLED, 120Hz, Dolby Vision, HDR Vivid, HDR10+, 3500 nits (peak)<br>
2.9 inches, 596 x 976 pixels</td>
				</tr>
				<tr>
					<td>Hệ điều hành:</td>
					<td>Android 16, HyperOS 3</td>
				</tr>
				<tr>
					<td>Camera sau:</td>
					<td>50 MP, f/1.7, 23mm (góc rộng), 1/1.28", 1.22µm, dual pixel PDAF, OIS<br>
50 MP, f/2.6, 115mm (tele tiềm vọng), 1/2.0", PDAF (30cm - ∞), OIS, zoom quang 5x<br>
50 MP, f/2.4, 17mm, 102˚ (góc siêu rộng), 1/2.76", 0.64µm<br>
Quay phim: 8K@30fps (HDR), 4K@30/60/120fps (HDR10+, 10-bit Dolby Vision HDR, 10-bit LOG), 1080p@30/60/120/240/960fps, 720p@1920fps, gyro-EIS</td>
				</tr>
				<tr>
					<td>Camera trước:</td>
					<td>50 MP, f/2.2, 21mm (góc rộng), PDAF, HDR, panorama<br>
Quay phim: 4K@30/60fps, 1080p@30/60fps, HDR10+, gyro-EIS</td>
				</tr>
				<tr>
					<td>CPU:</td>
					<td>Qualcomm Snapdragon 8 Elite Gen 5 (3 nm)<br>
8 nhân (2x4.6 GHz &amp; 6x3.62 GHz)<br>
GPU: Adreno 840</td>
				</tr>
				<tr>
					<td>RAM:</td>
					<td>12-16GB, LPDDR5X</td>
				</tr>
				<tr>
					<td>Bộ nhớ trong:</td>
					<td>256GB-1TB, UFS 4.1</td>
				</tr>
				<tr>
					<td>Thẻ SIM:</td>
					<td>2 SIM Nano<br>
Hoặc 2 SIM Nano + 2 eSIM</td>
				</tr>
				<tr>
					<td>Dung lượng pin:</td>
					<td>Si/C Li-Ion 7500 mAh<br>
Sạc siêu nhanh 100W, PD3.0, QC3+, 100W PPS<br>
Sạc không dây 50W<br>
Sạc ngược không dây 22.5W</td>
				</tr>
				<tr>
					<td>Thiết kế:</td>
					<td>Khung nhôm phẳng<br>
2 mặt kính cường lực phẳng<br>
Kháng nước, bụi IP68<br>
Cảm biến vân tay siêu âm dưới màn hình</td>
				</tr>
			</tbody>
		</table>', 2, GETDATE()),
(12750000, 1, 0, 'redmi_k80pro.jpg', N'Điện thoại Xiaomi REDMI K80 Pro 5G (Snapdragon 8 Elite - Pin 6000mAh)', 'redmi_k80pro', N'<table>
			<tbody>
				<tr>
					<td>Màn hình:</td>
					<td>OLED, 68 tỷ màu, 120Hz, Dolby Vision, HDR10+, 1800 nits (HBM), 3200 nits (peak)<br>
6.67 inches, 2K (1440 x 3200 pixels)<br>
Tỷ lệ 20:9, mật độ điểm ảnh ~526 ppi</td>
				</tr>
				<tr>
					<td>Hệ điều hành:</td>
					<td>Android 15, HyperOS 2.0</td>
				</tr>
				<tr>
					<td>Camera sau:</td>
					<td>50 MP, f/1.6, 24mm (góc rộng), 1/1.55", 1.0µm, dual pixel PDAF, OIS<br>
50 MP, f/2.0, 60mm (telephoto), 1/2.76", 0.64µm, PDAF (10cm - ∞), OIS, zoom quang 2.5x<br>
32 MP, f/2.2, 15mm, 120˚ (góc siêu rộng)<br>
Quay phim: 8K@24fps, 4K@24/30/60fps, 1080p@30/60/120/240/960fps, 720p@1920fps, gyro-EIS</td>
				</tr>
				<tr>
					<td>Camera trước:</td>
					<td>20 MP (wide), HDR<br>
Quay phim: 1080p@30/60fps, gyro-EIS</td>
				</tr>
				<tr>
					<td>CPU:</td>
					<td>Qualcomm SM8750-AB Snapdragon 8 Elite (3 nm)<br>
8 nhân (2x4.32 GHz &amp; 6x3.53 GHz)<br>
GPU: Adreno 830</td>
				</tr>
				<tr>
					<td>RAM:</td>
					<td>12-16GB, LPDDR5X</td>
				</tr>
				<tr>
					<td>Bộ nhớ trong:</td>
					<td>256GB-1TB, UFS 4.0</td>
				</tr>
				<tr>
					<td>Thẻ SIM:</td>
					<td>2 Nano SIM</td>
				</tr>
				<tr>
					<td>Dung lượng pin:</td>
					<td>Si/C 6000mAh<br>
Sạc siêu nhanh 120W, PD3.0, QC3+<br>
Sạc 100% pin trong 28 phút (QC)<br>
Sạc không dây 50W</td>
				</tr>
				<tr>
					<td>Thiết kế:</td>
					<td>Khung nhôm phẳng<br>
Mặt lưng kính cong nhẹ<br>
Mặt trước kính Longjing 2<br>
Kháng nước, bụi IP68 (ngâm 2.5m trong 30ph)<br>
Cảm biến vân tay siêu âm dưới màn hình</td>
				</tr>
			</tbody>
		</table>', 2, GETDATE()),
(7250000, 1, 0, 'oppo_k13.jpg', N'Điện thoại OPPO K13 Turbo Pro (Snapdragon 8s Gen 4)', 'oppo_k13', N'<table>
			<tbody>
				<tr>
					<td>Màn hình:</td>
					<td>AMOLED, 1 tỷ màu, 120Hz, 1600 nits (peak)<br>
6.8 inches, 1.5K (1280 x 2800 pixels)<br>
Tỷ lệ 19.5:9, mật độ điểm ảnh ~453 ppi</td>
				</tr>
				<tr>
					<td>Hệ điều hành:</td>
					<td>Android 15, ColorOS 15</td>
				</tr>
				<tr>
					<td>Camera sau:</td>
					<td>50 MP, f/1.8, 27mm (góc rộng), PDAF, OIS<br>
2 MP (phụ)<br>
Quay phim: 4K@30/60fps, 1080p@30fps</td>
				</tr>
				<tr>
					<td>Camera trước:</td>
					<td>16 MP, f/2.4, 22mm (góc rộng)<br>
Quay phim: 1080p@30fps</td>
				</tr>
				<tr>
					<td>CPU:</td>
					<td>Qualcomm SM8735 Snapdragon 8s Gen 4 (4 nm)<br>
8 nhân (1x3.21 GHz &amp; 3x3.0 GHz &amp; 2x2.8 GHz &amp; 2x2.0 GHz)<br>
GPU: Adreno 825</td>
				</tr>
				<tr>
					<td>RAM:</td>
					<td>12-16GB</td>
				</tr>
				<tr>
					<td>Bộ nhớ trong:</td>
					<td>256-512GB, UFS 4.0</td>
				</tr>
				<tr>
					<td>Thẻ SIM:</td>
					<td>2 SIM Nano</td>
				</tr>
				<tr>
					<td>Dung lượng pin:</td>
					<td>7000 mAh<br>
Sạc nhanh 80W, 13.5W PD, 44W UFCS, 33W PPS<br>
Hỗ trợ sạc ngược (dây)</td>
				</tr>
				<tr>
					<td>Thiết kế:</td>
					<td>Vuông vức đậm chất gaming<br>
Khung viền nhựa phẳng<br>
Mặt lưng nhựa phẳng<br>
Tích hợp quạt tản nhiệt + LED RGB<br>
Kháng nước IPX8/IPX9<br>
Cảm biến vân tay quang học dưới màn hình</td>
				</tr>
			</tbody>
		</table>', 3, GETDATE()),
(19950000, 1, 0, 'oppo_x9pro.jpg', N'Điện thoại OPPO Find X9 Pro (Dimensity 9500)', 'oppo_x9pro', N'<table>
			<tbody>
				<tr>
					<td>Màn hình:</td>
					<td>LTPO AMOLED, 1 tỷ màu, 120Hz, Dolby Vision, HDR10+, 800 nits (typ), 1600 nits (HBM), 4500 nits (peak)<br>
6.78 inches, 1.5K (1256 x 2760 pixels)</td>
				</tr>
				<tr>
					<td>Hệ điều hành:</td>
					<td>Android 16, ColorOS 16</td>
				</tr>
				<tr>
					<td>Camera sau:</td>
					<td>50 MP (góc rộng), PDAF, OIS<br>
50 MP (tiềm vọng tele), zoom quang 3x, PDAF, OIS<br>
50 MP (tiềm vọng tele), zoom quang 6x<br>
50 MP (góc rộng)<br>
Quay phim: 4K, 1080p; gyro-EIS; HDR, 10‑bit video, Dolby Vision</td>
				</tr>
				<tr>
					<td>Camera trước:</td>
					<td>32 MP (góc rộng), PDAF, Panorama<br>
Quay phim: 4K, 1080p, gyro-EIS</td>
				</tr>
				<tr>
					<td>CPU:</td>
					<td>MediaTek Dimensity 9500 (3 nm)<br>
8 nhân lên tới 4 GHz<br>
GPU: Immortalis-G9xx</td>
				</tr>
				<tr>
					<td>RAM:</td>
					<td>12-16GB</td>
				</tr>
				<tr>
					<td>Bộ nhớ trong:</td>
					<td>256GB-1TB, UFS 4.0</td>
				</tr>
				<tr>
					<td>Thẻ SIM:</td>
					<td></td>
				</tr>
				<tr>
					<td>Dung lượng pin:</td>
					<td>Si/C 6000 mAh<br>
Sạc nhanh 80W<br>
Sạc không dây 50W<br>
Sạc ngược 10W (không dây)</td>
				</tr>
				<tr>
					<td>Thiết kế:</td>
					<td></td>
				</tr>
			</tbody>
		</table>', 3, GETDATE()),
(22850000, 1, 0, 'oppo_x8ultra.jpg', N'Điện thoại OPPO Find X8 Ultra (Snapdragon 8 Elite)', 'oppo_x8ultra', N'<table>
			<tbody>
				<tr>
					<td>Màn hình:</td>
					<td>LTPO AMOLED, 1 tỷ màu, 120Hz, Dolby Vision, HDR Vivid, HDR10+, 800 nits (typ), 1600 nits (HBM), 2500 nits (peak)<br>
6.82 inches, QHD+ (1440 x 3168 pixels)<br>
Mật độ điểm ảnh ~510 ppi<br>
Hỗ trợ hình ảnh Ultra HDR</td>
				</tr>
				<tr>
					<td>Hệ điều hành:</td>
					<td>Android 15, ColorOS 15</td>
				</tr>
				<tr>
					<td>Camera sau:</td>
					<td>50 MP, f/1.8, 23mm (góc rộng), kích thước 1", 1.6µm, dual pixel PDAF, OIS<br>
50 MP, f/2.1, 70mm (tiềm vọng tele), 1/1.56", 1.0µm, zoom quang 3x, PDAF đa hướng (10cm - ∞), OIS<br>
50 MP, f/3.1, 135mm (tiềm vọng tele), 1/1/.95", 0.8µm, zoom quang 6x, PDAF điểm ảnh kép (35cm - ∞), OIS<br>
50 MP, f/2.0, 15mm, 120˚ (góc siêu rộng), 1/2.75", 0.64µm, PDAF<br>
Quay phim: 4K@30/60/120fps, 1080p@30/60/120/240fps; gyro-EIS; HDR, video 10 bit, Dolby Vision</td>
				</tr>
				<tr>
					<td>Camera trước:</td>
					<td>32 MP, f/2.4, 21mm (góc rộng), PDAF<br>
Ảnh toàn cảnh, HDR<br>
Quay phim: 4K@30/60fps, 1080p@30/60fps, con quay hồi chuyển-EIS</td>
				</tr>
				<tr>
					<td>CPU:</td>
					<td>Qualcomm SM8750-AB Snapdragon 8 Elite (3 nm)<br>
8 nhân (2x4.32 GHz &amp; 6x3.53 GHz)<br>
GPU: Adreno 830</td>
				</tr>
				<tr>
					<td>RAM:</td>
					<td>12-16GB, LPDDR5X</td>
				</tr>
				<tr>
					<td>Bộ nhớ trong:</td>
					<td>256GB-1TB, UFS 4.1</td>
				</tr>
				<tr>
					<td>Thẻ SIM:</td>
					<td>2 SIM Nano</td>
				</tr>
				<tr>
					<td>Dung lượng pin:</td>
					<td>Si/C Li-Ion 6100 mAh<br>
Sạc dây 100W, 18W PD, 18W QC, 55W PPS<br>
Sạc không dây 50W<br>
Sạc ngược 10W (không dây)</td>
				</tr>
				<tr>
					<td>Thiết kế:</td>
					<td>Khung nhôm phẳng<br>
Mặt lưng kính phẳng<br>
Kháng nước, bụi IP68/IP69<br>
Cảm biến vân tay siêu âm dưới màn hình</td>
				</tr>
			</tbody>
		</table>', 3, GETDATE()),
(36450000, 1, 0, 'oppo_n5.jpg', N'Điện thoại OPPO Find N5 Chính hãng (Snapdragon 8 Elite)', 'oppo_n5', N'<table>
			<tbody>
				<tr>
					<td>Màn hình:</td>
					<td>Màn trong: Foldable LTPO AMOLED, 1 tỷ màu, 120Hz, Dolby Vision, HDR10+, HDR Vivid, 1400 nits (HBM), 2100 nits (peak)<br>
8.12 inches, 2248 x 2480 pixels, mật độ điểm ảnh ~412 ppi<br>
Màn ngoài: LTPO OLED, 1 tỷ màu, 120Hz, Dolby Vision, HDR10+, HDR Vivid, 1600 nits (HBM), 2450 nits (peak)<br>
6.62 inches, 1.5K (1140 x 2616 pixels), 431 ppi<br>
Hỗ trợ hình ảnh Ultra HDR</td>
				</tr>
				<tr>
					<td>Hệ điều hành:</td>
					<td>Android 15, ColorOS 15</td>
				</tr>
				<tr>
					<td>Camera sau:</td>
					<td>50 MP, f/1.9, 21mm (góc rộng), 1/1.56”, PDAF, OIS<br>
50 MP, f/2.7, 75mm (tele tiềm vọng), 1/2.75", zoom quang 3x, PDAF (10cm - ∞), OIS<br>
8 MP, f/2.2, 15mm, 116˚ (góc siêu rộng), 1/4.0”, 1.12µm, AF<br>
Quay phim: 4K@30/60fps, 1080p@30/60/240fps gyro-EIS, HDR10+, Dolby Vision</td>
				</tr>
				<tr>
					<td>Camera trước:</td>
					<td>Selfie màn trong: 8MP, f/2.4, 21mm (góc siêu rộng)<br>
Selfie màn ngoài: 8MP, f/2.4, 21mm (góc siêu rộng)<br>
Quay phim: 4K@30fps, 1080p@30fps, gyro-EIS</td>
				</tr>
				<tr>
					<td>CPU:</td>
					<td>Qualcomm SM8750-3-AB Snapdragon 8 Elite (3 nm)<br>
7 nhân (2x4.32 &amp; 5x3.53 GHz)<br>
GPU: Adreno 830</td>
				</tr>
				<tr>
					<td>RAM:</td>
					<td>12-16GB, LPDDR5X</td>
				</tr>
				<tr>
					<td>Bộ nhớ trong:</td>
					<td>256GB-1TB, UFS 4.0</td>
				</tr>
				<tr>
					<td>Thẻ SIM:</td>
					<td>2 SIM Nano + eSIM<br>
Hoặc 2 SIM Nano</td>
				</tr>
				<tr>
					<td>Dung lượng pin:</td>
					<td>Pin Li-Ion 5600mAh<br>
Sạc nhanh 80W (100% trong 50 phút)<br>
Sạc không dây 50W<br>
Hỗ trợ sạc ngược có dây</td>
				</tr>
				<tr>
					<td>Thiết kế:</td>
					<td>Hỗ trợ bút stylus (cả hai màn hình)<br>
Kính màn hình ngoài Nanocrystal Glass<br>
Khung nhôm phẳng; Bản lề hợp kim titan<br>
Mặt lưng kính/da<br>
Kháng nước, bụi IPX8/IPX9</td>
				</tr>
			</tbody>
		</table>', 3, GETDATE()),
(16950000, 1, 0, 'oppo_x9plus.jpg', N'Điện thoại OPPO Find X9 Plus (Dimensity 9500)', 'oppo_x9plus', N'<table>
			<tbody>
				<tr>
					<td>Màn hình:</td>
					<td>AMOLED, 1 tỷ màu, 120Hz, Dolby Vision, HDR10+, 800 nits (typ), 1600 nits (HBM), 4500 nits (peak)<br>
6.78 inches, 1.5K (1256 x 2760 pixels)</td>
				</tr>
				<tr>
					<td>Hệ điều hành:</td>
					<td>Android 16, ColorOS 16</td>
				</tr>
				<tr>
					<td>Camera sau:</td>
					<td>50 MP (góc rộng), PDAF, OIS<br>
50 MP (tele), zoom quang 3x<br>
50 MP (góc siêu rộng)<br>
Quay phim: 4K, 1080p</td>
				</tr>
				<tr>
					<td>Camera trước:</td>
					<td>32 MP (góc rộng)<br>
Quay phim: 4K, 1080p</td>
				</tr>
				<tr>
					<td>CPU:</td>
					<td>MediaTek Dimensity 9500 (3 nm)<br>
8 nhân lên tới 4 GHz<br>
GPU: Immortalis-G9xx</td>
				</tr>
				<tr>
					<td>RAM:</td>
					<td>12-16GB</td>
				</tr>
				<tr>
					<td>Bộ nhớ trong:</td>
					<td>256GB-1TB, UFS 4.0</td>
				</tr>
				<tr>
					<td>Thẻ SIM:</td>
					<td></td>
				</tr>
				<tr>
					<td>Dung lượng pin:</td>
					<td>Si/C 6000 mAh<br>
Sạc nhanh 80W<br>
Sạc không dây 50W<br>
Sạc ngược 10W (không dây)</td>
				</tr>
				<tr>
					<td>Thiết kế:</td>
					<td></td>
				</tr>
			</tbody>
		</table>', 3, GETDATE()),
(17650000, 1, 0, 'vivo_x100spro.jpg', N'Điện thoại Vivo X100s Pro 5G (Dimensity 9300 Plus)', 'vivo_x100spro', N'<tbody>
				<tr>
					<td>Màn hình:</td>
					<td>LTPO AMOLED, 1 tỷ màu, 120Hz, 3000 nits (tối đa)<br>
6.78 inches, 1.5K (1260 x 2800 pixels)<br>
Tỷ lệ 20:9, mật độ điểm ảnh ~453 ppi</td>
				</tr>
				<tr>
					<td>Hệ điều hành:</td>
					<td>Android 14, OriginOS 4</td>
				</tr>
				<tr>
					<td>Camera sau:</td>
					<td>50 MP, f/1.8, 23mm (góc rộng), PDAF, Laser AF, OIS<br>
50 MP, f/2.5, 100mm (tele tiềm vọng), PDAF (18cm - ∞), OIS, zoom quang 4.3x<br>
50 MP, f/2.0, 15mm, 119 (góc siêu rộng), AF<br>
Quay phim: 8K@30fps (China model only), 4K@30/60fps, 1080p, gyro-EIS, Cinematic mode (4K)</td>
				</tr>
				<tr>
					<td>Camera trước:</td>
					<td>32 MP, f/2.0, 20mm (góc rộng). HDR<br>
Quay phim:  4K@30/60fps, 1080p@30/60fps</td>
				</tr>
				<tr>
					<td>CPU:</td>
					<td>MediaTek Dimensity 9300+ (4 nm)<br>
8 nhân (1x3.40 GHz &amp; 3x2.85 GHz &amp;4x2.00 GHz)<br>
GPU: Immortalis-G720 MC12</td>
				</tr>
				<tr>
					<td>RAM:</td>
					<td>12-16GB, LPDDR5X</td>
				</tr>
				<tr>
					<td>Bộ nhớ trong:</td>
					<td>256GB-1TB, UFS 4.0</td>
				</tr>
				<tr>
					<td>Thẻ SIM:</td>
					<td>2 SIM, Nano SIM</td>
				</tr>
				<tr>
					<td>Dung lượng pin:</td>
					<td>Li-Ion 5400 mAh<br>
Sạc siêu nhanh 100W<br>
Sạc không dây 50W<br>
Sạc ngược qua dây</td>
				</tr>
				<tr>
					<td>Thiết kế:</td>
					<td>Khung nhôm bo cong<br>
Mặt lưng kính cong; Màn hình cong<br>
Kháng nước, bụi IP69/IP68</td>
				</tr>
			</tbody>', 4, GETDATE()),
(16850000, 1, 0, 'vivo_x200fe.jpg', N'Điện thoại Vivo X200 FE (Quốc tế - Dimensity 9300 Plus)', 'vivo_x200fe', N'<table>
			<tbody>
				<tr>
					<td>Màn hình:</td>
					<td>LTPO AMOLED, 1 tỷ màu, 120Hz, HDR10+, 4500 nits (peak)<br>
6.31 inches, 1.5K (1216 x 2640 pixels)<br>
Tỷ lệ 19.5:9, mật độ điểm ảnh ~461 ppi</td>
				</tr>
				<tr>
					<td>Hệ điều hành:</td>
					<td>Android 15, Funtouch 15</td>
				</tr>
				<tr>
					<td>Camera sau:</td>
					<td>50 MP, f/1.9, 23mm (góc rộng), 1/1.56", 1.0µm, PDAF<br>
50 MP, f/2.7, 70mm (tiềm vọng tele), 1/1.95", 0.8µm, PDAF, OIS, zoom quang 3x<br>
8 MP, f/2.2 (góc siêu rộng), 1/4.0", 1.12µm<br>
Quay phim: 4K@30/60fps, 1080p@30/60/120fps, gyro-EIS, HDR</td>
				</tr>
				<tr>
					<td>Camera trước:</td>
					<td>50 MP, f/2.0 (góc rộng), HDR<br>
Quay phim: 4K, 1080p</td>
				</tr>
				<tr>
					<td>CPU:</td>
					<td>MediaTek Dimensity 9300+ (4 nm)<br>
8 nhân (1x3.4 GHz &amp; 3x2.85 GHz &amp; 4x2.0 GHz)<br>
GPU: Immortalis-G720 MC12</td>
				</tr>
				<tr>
					<td>RAM:</td>
					<td>12GB, LPDDR5X</td>
				</tr>
				<tr>
					<td>Bộ nhớ trong:</td>
					<td>256-512GB, UFS3.1</td>
				</tr>
				<tr>
					<td>Thẻ SIM:</td>
					<td>2 SIM Nano + eSIM (tối đa 2 SIM cùng lúc)</td>
				</tr>
				<tr>
					<td>Dung lượng pin:</td>
					<td>Si/C Li-Ion 6500 mAh<br>
Sạc nhanh 90W, 100% trong 57 phút<br>
Hỗ trợ sạc ngược (dây)</td>
				</tr>
				<tr>
					<td>Thiết kế:</td>
					<td>Khung nhôm phẳng<br>
Mặt lưng kính phẳng<br>
Kháng nước, bụi IP68/IP69<br>
Vân tay quang học dưới màn hình</td>
				</tr>
			</tbody>
		</table>', 4, GETDATE()),
(1645000, 1, 0, 'vivo_x200pro.jpg', N'Điện thoại Vivo X200 Pro 5G (Dimensity 9400 - Pin 6000mAh)', 'vivo_x200pro', N'<table>
			<tbody>
				<tr>
					<td>Màn hình:</td>
					<td>LTPO AMOLED, 1 tỷ màu, 120Hz, HDR10+, Dolby Vision, 4500 nits (peak)<br>
6.78 inches, 1.5K (1260 x 2800 pixels)<br>
Tỷ lệ 20:9, mật độ điểm ảnh ~452 ppi</td>
				</tr>
				<tr>
					<td>Hệ điều hành:</td>
					<td>Android 15, OriginOS 5</td>
				</tr>
				<tr>
					<td>Camera sau:</td>
					<td>50 MP, f/1.6, 23mm (góc rộng), 1/1.28", 1.22µm, PDAF, OIS<br>
200 MP, f/2.7, 85mm (tiềm vọng tele), 1/1.4", 0.56µm, multi-directional PDAF, OIS, 3.7x optical zoom, macro 2.7:1<br>
50 MP, f/2.0, 15mm, 119˚ (góc siêu rộng), 1/2.76", 0.64µm, AF<br>
Quay phim: 8K@30fps, 4K@30/60/120fps, 1080p, gyro-EIS, 10-bit HDR</td>
				</tr>
				<tr>
					<td>Camera trước:</td>
					<td>32 MP, f/2.0, 20mm (góc siêu rộng), HDR<br>
Quay phim: 4K@30/60fps, 1080p@30/60fps</td>
				</tr>
				<tr>
					<td>CPU:</td>
					<td>MediaTek Dimensity 9400 (3 nm)<br>
8 nhân (1x3.63 GHz &amp; 3x3.3 GHz &amp; 4x2.4 GHz)<br>
GPU: Immortalis-G925</td>
				</tr>
				<tr>
					<td>RAM:</td>
					<td>12-16GB, LPDDR5X<br>
Hoặc LPDDR5X Ultra Pro (chỉ dành cho phiên bản vệ tinh)</td>
				</tr>
				<tr>
					<td>Bộ nhớ trong:</td>
					<td>256GB-1TB, UFS 4.0</td>
				</tr>
				<tr>
					<td>Thẻ SIM:</td>
					<td>2 SIM, Nano SIM</td>
				</tr>
				<tr>
					<td>Dung lượng pin:</td>
					<td>Si/C 6000 mAh<br>
Sạc nhanh 90W<br>
Sạc không dây 30W<br>
Hỗ trợ sạc ngược (dây)</td>
				</tr>
				<tr>
					<td>Thiết kế:</td>
					<td>Khung hợp kim nhôm phẳng<br>
Mặt lưng kính cong nhẹ<br>
Màn hình cong nhẹ kính Scratch/drop-resistant<br>
Cảm biến vân tay siêu âm dưới màn hình<br>
Kháng nước, bụi IP68/IP69</td>
				</tr>
			</tbody>
		</table>', 4, GETDATE()),
(19950000, 1, 0, 'vivo_x100ultra.jpg', N'Điện thoại Vivo X100 Ultra 5G (Camera tiềm vọng 200MP - Kết nối vệ tinh)', 'vivo_x100ultra', N'<table>
			<tbody>
				<tr>
					<td>Màn hình:</td>
					<td>LTPO AMOLED, 1 tỷ màu, 120Hz, Dolby Vision, HDR, 3000 nits (tối đa)<br>
6.78 inches, QHD+ (1440 x 3200 pixels)<br>
Tỷ lệ 20:9, mật độ điểm ảnh ~517 ppi</td>
				</tr>
				<tr>
					<td>Hệ điều hành:</td>
					<td>Android 14, OriginOS 4</td>
				</tr>
				<tr>
					<td>Camera sau:</td>
					<td>50 MP, f/1.8, 23mm (góc rộng), 1/0.98", 1.6µm, dual pixel PDAF, gimbal OIS<br>
200 MP, f/2.7, 85mm (tele tiềm vọng), PDAF, OIS, zoom quang 3.7x<br>
50 MP, f/2.2, 14mm, 116˚ (góc siêu rộng), AF<br>
Quay phim: 8K@30fps, 4K@30/60/120fps, 1080p, gyro-EIS, Cinematic mode (4K), Dolby Vision HDR</td>
				</tr>
				<tr>
					<td>Camera trước:</td>
					<td>50 MP, f/2.5 (góc rộng), HDR<br>
Quay phim: 4K@30/60fps, 1080p@30/60fps</td>
				</tr>
				<tr>
					<td>CPU:</td>
					<td>Qualcomm SM8650-AB Snapdragon 8 Gen 3 (4 nm)<br>
8 nhân (1x3.3 GHz &amp; 3x3.2 GHz &amp; 2x3.0 GHz &amp; 2x2.3 GHz)<br>
GPU: Adreno 750</td>
				</tr>
				<tr>
					<td>RAM:</td>
					<td>12-16GB, LPDDR5X</td>
				</tr>
				<tr>
					<td>Bộ nhớ trong:</td>
					<td>256GB-1TB, UFS 4.0</td>
				</tr>
				<tr>
					<td>Thẻ SIM:</td>
					<td>2 SIM, Nano SIM</td>
				</tr>
				<tr>
					<td>Dung lượng pin:</td>
					<td>5500 mAh<br>
Sạc nhanh 80W<br>
Sạc không dây 30W<br>
Hỗ trợ sạc ngược qua dây</td>
				</tr>
				<tr>
					<td>Thiết kế:</td>
					<td>Khung kim loại bo cong<br>
Mặt lưng kính cong<br>
Màn hình cong + cảm biến vân tay siêu âm<br>
Kháng nước, bụi IP69/IP68</td>
				</tr>
			</tbody>
		</table>', 4, GETDATE()),
(22450000, 1, 0, 'vivo_x200ultra.jpg', N'Điện thoại Vivo X200 Ultra (Snapdragon 8 Elite)', 'vivo_x200ultra', N'<table>
			<tbody>
				<tr>
					<td>Màn hình:</td>
					<td>LTPO AMOLED, 1 tỷ màu, 120Hz, Dolby Vision, HDR Vivid, 4500 nits (peak)<br>
6.82 inches, 2K (1440 x 3168 pixels)<br>
Mật độ điểm ảnh ~510 ppi<br>
Kính cường lực Armor</td>
				</tr>
				<tr>
					<td>Hệ điều hành:</td>
					<td>Android 15, OriginOS 5</td>
				</tr>
				<tr>
					<td>Camera sau:</td>
					<td>50 MP, f/1.7, 35mm (góc rộng), 1/1.28", 1.22µm, dual pixel PDAF, gimbal OIS<br>
200 MP, f/2.3, 85mm (tiềm vọng tele), 1/1.4", 0.56µm, PDAF đa hướng, OIS, zoom quang 3.7x, macro 3.4:1 (ống kính zoom bổ sung tùy chọn: f/2.3, 200mm, zoom quang 2.35x, quang học Zeiss)<br>
50 MP, f/2.0, 14mm, 116˚ (góc siêu rộng), 1/1.28", 1.22µm, PDAF điểm ảnh kép, OIS<br>
Quay phim: 8K@30fps, 4K@30/60/120fps, 1080p@30/60/120/240fps, gyro-EIS, Dolby Vision HDR, 10-bit Log, HDR10+</td>
				</tr>
				<tr>
					<td>Camera trước:</td>
					<td>50 MP, f/2.5, 24mm (góc rộng), 1/2.76", 0.64µm, AF, HDR<br>
Quay phim: 4K@30/60fps, 1080p@30/60fps</td>
				</tr>
				<tr>
					<td>CPU:</td>
					<td>Qualcomm SM8750-AB Snapdragon 8 Elite (3 nm)<br>
8 nhân (2x4.32 GHz &amp; 6x3.53 GHz)<br>
GPU: Adreno 830</td>
				</tr>
				<tr>
					<td>RAM:</td>
					<td>12-16GB, LPDDR5X Ultra (4 kênh)</td>
				</tr>
				<tr>
					<td>Bộ nhớ trong:</td>
					<td>256GB-1TB, UFS 4.1</td>
				</tr>
				<tr>
					<td>Thẻ SIM:</td>
					<td>2 SIM Nano</td>
				</tr>
				<tr>
					<td>Dung lượng pin:</td>
					<td>Si/C Li-Ion 6000mAh<br>
Sạc nhanh 90W<br>
Sạc không dây 40W<br>
Hỗ trợ sạc ngược (dây + Không đây)</td>
				</tr>
				<tr>
					<td>Thiết kế:</td>
					<td>Khung nhôm phẳng<br>
Mặt lưng kính cong rất nhẹ<br>
Màn hình cong nhẹ 4 cạnh<br>
Cảm biến vân tay siêu âm 3D dưới màn hình<br>
Kháng nước, bụi IP68/IP69</td>
				</tr>
			</tbody>
		</table>', 4, GETDATE()),
(7150000, 1, 0, 'realme_neo7.jpg', N'Điện thoại Realme Neo7 (Dimensity 9300 Plus - Pin 7000mAh)', 'realme_neo7', N'<table>
			<tbody>
				<tr>
					<td>Màn hình:</td>
					<td>LTPO AMOLED, 1 tỷ màu, 120Hz, HDR, 1600 nits (HBM), 6000 nits (peak)<br>
6.78 inches, 1.5K (1264 x 2780 pixels)<br>
Tỷ lệ 20:9, mật độ điểm ảnh ~450 ppi<br>
Hỗ trợ hình ảnh HDR<br>
Kính Crystal Armor</td>
				</tr>
				<tr>
					<td>Hệ điều hành:</td>
					<td>Android 15, Realme UI 6.0</td>
				</tr>
				<tr>
					<td>Camera sau:</td>
					<td>50 MP, f/1.9, 26mm (góc rộng), 1/1.95", PDAF, OIS<br>
8 MP, f/2.2, 16mm, 112˚ (góc siêu rộng)<br>
Quay phim: 4K@30/60fps, 1080p@30/60/120fps</td>
				</tr>
				<tr>
					<td>Camera trước:</td>
					<td>16 MP, f/2.4, 23mm (góc rộng)<br>
Quay phim: 1080p@30fps<br>
Hoặc 1080p@30fps/60fps (Bản phần mềm mới)</td>
				</tr>
				<tr>
					<td>CPU:</td>
					<td>MediaTek Dimensity 9300 Plus (4 nm)<br>
8 nhân (1x3.4 GHz &amp; 3x2.85 GHz &amp; 4x2.0 GHz)<br>
GPU: Immortalis-G720 MC12</td>
				</tr>
				<tr>
					<td>RAM:</td>
					<td>12-16GB</td>
				</tr>
				<tr>
					<td>Bộ nhớ trong:</td>
					<td>256GB-1TB, UFS 4.0</td>
				</tr>
				<tr>
					<td>Thẻ SIM:</td>
					<td>2 SIM Nano</td>
				</tr>
				<tr>
					<td>Dung lượng pin:</td>
					<td>Si/C 7000 mAh<br>
Sạc nhanh 80W</td>
				</tr>
				<tr>
					<td>Thiết kế:</td>
					<td>Khung nhựa phẳng<br>
Mặt lưng cong nhẹ<br>
Kháng nước, bụi IP68/IP69</td>
				</tr>
			</tbody>
		</table>', 5, GETDATE()),
(7450000, 1, 0, 'realme_neo7turbo.jpg', N'Điện thoại Realme Neo7 Turbo (Dimensity 9400e)', 'realme_neo7turbo', N'<table>
			<tbody>
				<tr>
					<td>Màn hình:</td>
					<td>AMOLED, 1 tỷ màu, 144Hz, HDR, 1800 nits (HBM), 6500 nits (peak)<br>
6.8 inches, 1.5K (1280 x 2800 pixels)<br>
Tỷ lệ 19.5: 9, mật độ điểm ảnh ~453 ppi</td>
				</tr>
				<tr>
					<td>Hệ điều hành:</td>
					<td>Android 15, Realme UI 6.0</td>
				</tr>
				<tr>
					<td>Camera sau:</td>
					<td>50 MP, f/1.8, 26mm (góc rộng), 1/1.95", 0.8µm, PDAF, OIS<br>
8 MP, f/2.2, 16mm, 112˚ (góc siêu rộng)  1/4.0", 1.12µm<br>
Quay phim: 4K@30/60fps, 1080p@30/60/120fps, gyro-EIS, OIS</td>
				</tr>
				<tr>
					<td>Camera trước:</td>
					<td>16 MP, f/2.4, 23mm (góc rộng), Panorama<br>
Quay phim: 1080p@30/60fps, gyro-EIS</td>
				</tr>
				<tr>
					<td>CPU:</td>
					<td>MediaTek Dimensity 9400e (4 nm)<br>
8 nhân (1x3.4 GHz &amp; 3x2.85 GHz &amp; 4x2.0 GHz)<br>
GPU: Immortalis-G720 MC12</td>
				</tr>
				<tr>
					<td>RAM:</td>
					<td>12-16GB, LPDDR5X</td>
				</tr>
				<tr>
					<td>Bộ nhớ trong:</td>
					<td>256-512GB, UFS 4.0</td>
				</tr>
				<tr>
					<td>Thẻ SIM:</td>
					<td>2 SIM Nano</td>
				</tr>
				<tr>
					<td>Dung lượng pin:</td>
					<td>Si/C Li-Ion 7200 mAh<br>
Sạc nhanh 100W, PD, PPS, UFCS<br>
Sạc 100% trong 47 phút</td>
				</tr>
				<tr>
					<td>Thiết kế:</td>
					<td>Khung nhựa phẳng<br>
Màn hình phẳng + Mặt lưng cong nhẹ<br>
Kháng nước, bụi IP68/IP69<br>
Cảm biến vân tay quang học dưới màn hình</td>
				</tr>
			</tbody>
		</table>', 5, GETDATE()),
(9450000, 1, 0, 'realme_gt7.jpg', N'Điện thoại Realme GT7 5G (Dimensity 9400 Plus - Pin 7200mAh)', 'realme_gt7', N'<table>
			<tbody>
				<tr>
					<td>Màn hình:</td>
					<td>AMOLED, 1 tỷ màu, 144Hz, HDR, 1800 nits (HBM), 6500 nits (peak)<br>
6.8 inches, 1.5K (1280 x 2800 pixels)<br>
Tỷ lệ 19.5:9, mật độ điểm ảnh ~453 ppi</td>
				</tr>
				<tr>
					<td>Hệ điều hành:</td>
					<td>Android 15, Realme UI 6</td>
				</tr>
				<tr>
					<td>Camera sau:</td>
					<td>50 MP, f/1.8, 24mm (góc rộng), 1/1.56", 1.0µm, multi-directional PDAF, OIS<br>
8 MP, f/2.2, 16mm, 112˚ (góc siêu rộng), 1/4.0", 1.12µm<br>
Quay phim: 4K@30/60fps, 1080p@30/60/120fps, gyro-EIS</td>
				</tr>
				<tr>
					<td>Camera trước:</td>
					<td>16 MP, f/2.4, 23mm (góc rộng), 1/3.0", 1.0µm<br>
Quay phim: 1080p@30/60fps, gyro-EIS</td>
				</tr>
				<tr>
					<td>CPU:</td>
					<td>MediaTek Dimensity 9400 Plus (3 nm)<br>
8 nhân (1x3.73 GHz &amp; 3x3.3 GHz &amp; 4x2.4 GHz)<br>
GPU: Immortalis-G925 MC12</td>
				</tr>
				<tr>
					<td>RAM:</td>
					<td>12-16GB</td>
				</tr>
				<tr>
					<td>Bộ nhớ trong:</td>
					<td>256GB-1TB, UFS 4.0</td>
				</tr>
				<tr>
					<td>Thẻ SIM:</td>
					<td>2 SIM Nano</td>
				</tr>
				<tr>
					<td>Dung lượng pin:</td>
					<td>Si/C Li-Ion 7200 mAh<br>
Sạc nhanh 100W<br>
Hỗ trợ sạc nhánh (Bypass charging)</td>
				</tr>
				<tr>
					<td>Thiết kế:</td>
					<td>Khung nhựa phẳng<br>
Mặt lưng cong nhẹ<br>
Cảm biến vân tay siêu âm dưới màn hình<br>
Kháng nước bụi IP68/IP69</td>
				</tr>
			</tbody>
		</table>', 5, GETDATE()),
(11650000, 1, 0, 'realme_gt7pro.jpg', N'Điện thoại Realme GT7 Pro 5G (Snapdragon 8 Elite)', 'realme_gt7pro', N'<table>
			<tbody>
				<tr>
					<td>Màn hình:</td>
					<td>LTPO AMOLED, 1 tỷ màu, 120Hz, HDR10+, Dolby Vision, 2000 nits (HBM), 6000 nits (peak)<br>
6.78 inches, 1.5K (1264 x 2780 pixels)<br>
Mật độ điểm ảnh ~450 ppi</td>
				</tr>
				<tr>
					<td>Hệ điều hành:</td>
					<td>Android 15, Realme UI 6.0</td>
				</tr>
				<tr>
					<td>Camera sau:</td>
					<td>50 MP, Sony IMX906, f/1.8, 24mm (góc rộng), 1/1.56", PDAF, OIS<br>
50 MP, f/2.7, 73m (tiềm vọng tele), 1/1.95", PDAF, OIS, OIS, zoom quang 3x<br>
8 MP, f/2.2, 16mm, 112˚ (góc siêu rộng), 1/4.0", 1.12µm<br>
Quay phim: 8K@24fps, 4K@30/60fps, 1080p@30/60/120/240fps, gyro-EIS</td>
				</tr>
				<tr>
					<td>Camera trước:</td>
					<td>16 MP, f/2.5, 25mm (góc rộng), Panorama<br>
Quay phim: 1080p@30fps</td>
				</tr>
				<tr>
					<td>CPU:</td>
					<td>Qualcomm SM8750-AB Snapdragon 8 Elite (3 nm)<br>
8 nhân (4.32 GHz &amp; 6x3.53 GHz)<br>
GPU: Adreno 830 (1.100MHz)</td>
				</tr>
				<tr>
					<td>RAM:</td>
					<td>12-16GB, LPDDR5X</td>
				</tr>
				<tr>
					<td>Bộ nhớ trong:</td>
					<td>256GB-1TB, UFS4.0</td>
				</tr>
				<tr>
					<td>Thẻ SIM:</td>
					<td>2 SIM, Nano SIM</td>
				</tr>
				<tr>
					<td>Dung lượng pin:</td>
					<td>Si/C 6500mAh<br>
Sạc siêu nhanh 120W</td>
				</tr>
				<tr>
					<td>Thiết kế:</td>
					<td>Khung nhôm phẳng<br>
Mặt lưng kính<br>
Màn hình cong nhẹ tứ phía<br>
Cảm biến vân tay siêu âm dưới màn hình<br>
Kháng nước, bụi IP68/IP69</td>
				</tr>
			</tbody>
		</table>', 5, GETDATE()),
(9750000, 1, 0, 'realme_15pro.jpg', N'Điện thoại Realme 15 Pro 5G (AI Party Phone)', 'realme_15pro', N'<table>
			<tbody>
				<tr>
					<td>Màn hình:</td>
					<td>OLED, 1 tỷ màu, 144Hz, 4608Hz PWM, 1800 nits (HBM), 6500 nits (peak)<br>
6.8 inches, 1.5K (1280 x 2800 pixels)<br>
Tỷ lệ 19.5:9, mật độ điểm ảnh ~453 ppi</td>
				</tr>
				<tr>
					<td>Hệ điều hành:</td>
					<td>Android 15, Realme UI 6.0</td>
				</tr>
				<tr>
					<td>Camera sau:</td>
					<td>50 MP, f/1.8, 24mm, Sony IMX896 (góc rộng), 1/1.56", PDAF, OIS<br>
50 MP, f/2.0, 116˚ (góc siêu rộng), 1/2.88", 0.61µm<br>
Quay phim: 4K@30/60fps, 1080p@30/60/120fps, gyro-EIS, OIS</td>
				</tr>
				<tr>
					<td>Camera trước:</td>
					<td>50 MP, f/2.4, 87˚ (góc rộng), 1/2.88", 0.61µm<br>
Quay phim: 4K@30/60fps, 1080p@30/60fps</td>
				</tr>
				<tr>
					<td>CPU:</td>
					<td>Qualcomm SM7750-AB Snapdragon 7 Gen 4 (4 nm)<br>
8 nhân (1x2.8GHz &amp; 4x2.4GHz &amp; 3x1.8GHz)<br>
GPU: Adreno 722</td>
				</tr>
				<tr>
					<td>RAM:</td>
					<td>8-12GB, LPDDR4X</td>
				</tr>
				<tr>
					<td>Bộ nhớ trong:</td>
					<td>256-512GB, UFS 3.1</td>
				</tr>
				<tr>
					<td>Thẻ SIM:</td>
					<td>2 SIM Nano</td>
				</tr>
				<tr>
					<td>Dung lượng pin:</td>
					<td>Si/C Li-Ion 7000 mAh<br>
Sạc nhanh 80W</td>
				</tr>
				<tr>
					<td>Thiết kế:</td>
					<td>Khung nhựa phẳng<br>
Mặt lưng nhựa cong<br>
Màn hình cong kính Gorilla<br>
Vân tay quang học dưới màn hình<br>
Kháng nước, bụi IP68/IP69<br>
Siêu bền theo tiêu chuẩn Quân đội Mỹ (MIL-STD-810H)</td>
				</tr>
			</tbody>
		</table>', 5, GETDATE());