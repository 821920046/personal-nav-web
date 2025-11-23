// 中国城市数据
// 包含省份、城市名称和对应的城市代码（用于天气API）

export interface City {
    name: string;
    code: string; // 和风天气城市代码
    adcode: string; // 高德地图行政区划代码
    province: string;
}

export const CHINA_CITIES: Record<string, City[]> = {
    '北京市': [
        { name: '北京', code: '101010100', adcode: '110000', province: '北京市' },
    ],
    '天津市': [
        { name: '天津', code: '101030100', adcode: '120000', province: '天津市' },
    ],
    '河北省': [
        { name: '石家庄', code: '101090101', adcode: '130100', province: '河北省' },
        { name: '唐山', code: '101090201', adcode: '130200', province: '河北省' },
        { name: '秦皇岛', code: '101091101', adcode: '130300', province: '河北省' },
        { name: '邯郸', code: '101090401', adcode: '130400', province: '河北省' },
        { name: '邢台', code: '101090501', adcode: '130500', province: '河北省' },
        { name: '保定', code: '101090201', adcode: '130600', province: '河北省' },
        { name: '张家口', code: '101090301', adcode: '130700', province: '河北省' },
        { name: '承德', code: '101090402', adcode: '130800', province: '河北省' },
        { name: '沧州', code: '101090701', adcode: '130900', province: '河北省' },
        { name: '廊坊', code: '101090601', adcode: '131000', province: '河北省' },
        { name: '衡水', code: '101090801', adcode: '131100', province: '河北省' },
    ],
    '山西省': [
        { name: '太原', code: '101100101', adcode: '140100', province: '山西省' },
        { name: '大同', code: '101100201', adcode: '140200', province: '山西省' },
        { name: '阳泉', code: '101100301', adcode: '140300', province: '山西省' },
        { name: '长治', code: '101100401', adcode: '140400', province: '山西省' },
        { name: '晋城', code: '101100501', adcode: '140500', province: '山西省' },
        { name: '朔州', code: '101100601', adcode: '140600', province: '山西省' },
        { name: '晋中', code: '101100701', adcode: '140700', province: '山西省' },
        { name: '运城', code: '101100801', adcode: '140800', province: '山西省' },
        { name: '忻州', code: '101100901', adcode: '140900', province: '山西省' },
        { name: '临汾', code: '101101001', adcode: '141000', province: '山西省' },
        { name: '吕梁', code: '101101101', adcode: '141100', province: '山西省' },
    ],
    '内蒙古自治区': [
        { name: '呼和浩特', code: '101080101', adcode: '150100', province: '内蒙古自治区' },
        { name: '包头', code: '101080201', adcode: '150200', province: '内蒙古自治区' },
        { name: '乌海', code: '101080301', adcode: '150300', province: '内蒙古自治区' },
        { name: '赤峰', code: '101080401', adcode: '150400', province: '内蒙古自治区' },
        { name: '通辽', code: '101080501', adcode: '150500', province: '内蒙古自治区' },
        { name: '鄂尔多斯', code: '101080601', adcode: '150600', province: '内蒙古自治区' },
        { name: '呼伦贝尔', code: '101080701', adcode: '150700', province: '内蒙古自治区' },
        { name: '巴彦淖尔', code: '101080801', adcode: '150800', province: '内蒙古自治区' },
        { name: '乌兰察布', code: '101080901', adcode: '150900', province: '内蒙古自治区' },
    ],
    '辽宁省': [
        { name: '沈阳', code: '101070101', adcode: '210100', province: '辽宁省' },
        { name: '大连', code: '101070201', adcode: '210200', province: '辽宁省' },
        { name: '鞍山', code: '101070301', adcode: '210300', province: '辽宁省' },
        { name: '抚顺', code: '101070401', adcode: '210400', province: '辽宁省' },
        { name: '本溪', code: '101070501', adcode: '210500', province: '辽宁省' },
        { name: '丹东', code: '101070601', adcode: '210600', province: '辽宁省' },
        { name: '锦州', code: '101070701', adcode: '210700', province: '辽宁省' },
        { name: '营口', code: '101070801', adcode: '210800', province: '辽宁省' },
        { name: '阜新', code: '101070901', adcode: '210900', province: '辽宁省' },
        { name: '辽阳', code: '101071001', adcode: '211000', province: '辽宁省' },
        { name: '盘锦', code: '101071101', adcode: '211100', province: '辽宁省' },
        { name: '铁岭', code: '101071201', adcode: '211200', province: '辽宁省' },
        { name: '朝阳', code: '101071301', adcode: '211300', province: '辽宁省' },
        { name: '葫芦岛', code: '101071401', adcode: '211400', province: '辽宁省' },
    ],
    '吉林省': [
        { name: '长春', code: '101060101', adcode: '220100', province: '吉林省' },
        { name: '吉林', code: '101060201', adcode: '220200', province: '吉林省' },
        { name: '四平', code: '101060301', adcode: '220300', province: '吉林省' },
        { name: '辽源', code: '101060401', adcode: '220400', province: '吉林省' },
        { name: '通化', code: '101060501', adcode: '220500', province: '吉林省' },
        { name: '白山', code: '101060601', adcode: '220600', province: '吉林省' },
        { name: '松原', code: '101060701', adcode: '220700', province: '吉林省' },
        { name: '白城', code: '101060801', adcode: '220800', province: '吉林省' },
    ],
    '黑龙江省': [
        { name: '哈尔滨', code: '101050101', adcode: '230100', province: '黑龙江省' },
        { name: '齐齐哈尔', code: '101050201', adcode: '230200', province: '黑龙江省' },
        { name: '鸡西', code: '101050301', adcode: '230300', province: '黑龙江省' },
        { name: '鹤岗', code: '101050401', adcode: '230400', province: '黑龙江省' },
        { name: '双鸭山', code: '101050501', adcode: '230500', province: '黑龙江省' },
        { name: '大庆', code: '101050601', adcode: '230600', province: '黑龙江省' },
        { name: '伊春', code: '101050701', adcode: '230700', province: '黑龙江省' },
        { name: '佳木斯', code: '101050801', adcode: '230800', province: '黑龙江省' },
        { name: '七台河', code: '101050901', adcode: '230900', province: '黑龙江省' },
        { name: '牡丹江', code: '101051001', adcode: '231000', province: '黑龙江省' },
        { name: '黑河', code: '101051101', adcode: '231100', province: '黑龙江省' },
        { name: '绥化', code: '101051201', adcode: '231200', province: '黑龙江省' },
    ],
    '上海市': [
        { name: '上海', code: '101020100', adcode: '310000', province: '上海市' },
    ],
    '江苏省': [
        { name: '南京', code: '101190101', adcode: '320100', province: '江苏省' },
        { name: '无锡', code: '101190201', adcode: '320200', province: '江苏省' },
        { name: '徐州', code: '101190301', adcode: '320300', province: '江苏省' },
        { name: '常州', code: '101191101', adcode: '320400', province: '江苏省' },
        { name: '苏州', code: '101190401', adcode: '320500', province: '江苏省' },
        { name: '南通', code: '101190501', adcode: '320600', province: '江苏省' },
        { name: '连云港', code: '101191001', adcode: '320700', province: '江苏省' },
        { name: '淮安', code: '101190701', adcode: '320800', province: '江苏省' },
        { name: '盐城', code: '101190801', adcode: '320900', province: '江苏省' },
        { name: '扬州', code: '101190601', adcode: '321000', province: '江苏省' },
        { name: '镇江', code: '101190901', adcode: '321100', province: '江苏省' },
        { name: '泰州', code: '101191201', adcode: '321200', province: '江苏省' },
        { name: '宿迁', code: '101191301', adcode: '321300', province: '江苏省' },
    ],
    '浙江省': [
        { name: '杭州', code: '101210101', adcode: '330100', province: '浙江省' },
        { name: '宁波', code: '101210401', adcode: '330200', province: '浙江省' },
        { name: '温州', code: '101210601', adcode: '330300', province: '浙江省' },
        { name: '嘉兴', code: '101210201', adcode: '330400', province: '浙江省' },
        { name: '湖州', code: '101210301', adcode: '330500', province: '浙江省' },
        { name: '绍兴', code: '101210501', adcode: '330600', province: '浙江省' },
        { name: '金华', code: '101210901', adcode: '330700', province: '浙江省' },
        { name: '衢州', code: '101210801', adcode: '330800', province: '浙江省' },
        { name: '舟山', code: '101211101', adcode: '330900', province: '浙江省' },
        { name: '台州', code: '101210701', adcode: '331000', province: '浙江省' },
        { name: '丽水', code: '101211001', adcode: '331100', province: '浙江省' },
    ],
    '安徽省': [
        { name: '合肥', code: '101220101', adcode: '340100', province: '安徽省' },
        { name: '芜湖', code: '101220301', adcode: '340200', province: '安徽省' },
        { name: '蚌埠', code: '101220201', adcode: '340300', province: '安徽省' },
        { name: '淮南', code: '101220401', adcode: '340400', province: '安徽省' },
        { name: '马鞍山', code: '101220501', adcode: '340500', province: '安徽省' },
        { name: '淮北', code: '101220601', adcode: '340600', province: '安徽省' },
        { name: '铜陵', code: '101220701', adcode: '340700', province: '安徽省' },
        { name: '安庆', code: '101220801', adcode: '340800', province: '安徽省' },
        { name: '黄山', code: '101221001', adcode: '341000', province: '安徽省' },
        { name: '滁州', code: '101221101', adcode: '341100', province: '安徽省' },
        { name: '阜阳', code: '101220901', adcode: '341200', province: '安徽省' },
        { name: '宿州', code: '101221201', adcode: '341300', province: '安徽省' },
        { name: '六安', code: '101221301', adcode: '341500', province: '安徽省' },
        { name: '亳州', code: '101221401', adcode: '341600', province: '安徽省' },
        { name: '池州', code: '101221501', adcode: '341700', province: '安徽省' },
        { name: '宣城', code: '101221601', adcode: '341800', province: '安徽省' },
    ],
    '福建省': [
        { name: '福州', code: '101230101', adcode: '350100', province: '福建省' },
        { name: '厦门', code: '101230201', adcode: '350200', province: '福建省' },
        { name: '莆田', code: '101230401', adcode: '350300', province: '福建省' },
        { name: '三明', code: '101230501', adcode: '350400', province: '福建省' },
        { name: '泉州', code: '101230601', adcode: '350500', province: '福建省' },
        { name: '漳州', code: '101230701', adcode: '350600', province: '福建省' },
        { name: '南平', code: '101230801', adcode: '350700', province: '福建省' },
        { name: '龙岩', code: '101230901', adcode: '350800', province: '福建省' },
        { name: '宁德', code: '101230301', adcode: '350900', province: '福建省' },
    ],
    '江西省': [
        { name: '南昌', code: '101240101', adcode: '360100', province: '江西省' },
        { name: '景德镇', code: '101240301', adcode: '360200', province: '江西省' },
        { name: '萍乡', code: '101240401', adcode: '360300', province: '江西省' },
        { name: '九江', code: '101240201', adcode: '360400', province: '江西省' },
        { name: '新余', code: '101240501', adcode: '360500', province: '江西省' },
        { name: '鹰潭', code: '101240601', adcode: '360600', province: '江西省' },
        { name: '赣州', code: '101240701', adcode: '360700', province: '江西省' },
        { name: '吉安', code: '101240901', adcode: '360800', province: '江西省' },
        { name: '宜春', code: '101240801', adcode: '360900', province: '江西省' },
        { name: '抚州', code: '101241001', adcode: '361000', province: '江西省' },
        { name: '上饶', code: '101241101', adcode: '361100', province: '江西省' },
    ],
    '山东省': [
        { name: '济南', code: '101120101', adcode: '370100', province: '山东省' },
        { name: '青岛', code: '101120201', adcode: '370200', province: '山东省' },
        { name: '淄博', code: '101120301', adcode: '370300', province: '山东省' },
        { name: '枣庄', code: '101120401', adcode: '370400', province: '山东省' },
        { name: '东营', code: '101120501', adcode: '370500', province: '山东省' },
        { name: '烟台', code: '101120601', adcode: '370600', province: '山东省' },
        { name: '潍坊', code: '101120701', adcode: '370700', province: '山东省' },
        { name: '济宁', code: '101120801', adcode: '370800', province: '山东省' },
        { name: '泰安', code: '101120901', adcode: '370900', province: '山东省' },
        { name: '威海', code: '101121001', adcode: '371000', province: '山东省' },
        { name: '日照', code: '101121101', adcode: '371100', province: '山东省' },
        { name: '临沂', code: '101121301', adcode: '371300', province: '山东省' },
        { name: '德州', code: '101121401', adcode: '371400', province: '山东省' },
        { name: '聊城', code: '101121501', adcode: '371500', province: '山东省' },
        { name: '滨州', code: '101121601', adcode: '371600', province: '山东省' },
        { name: '菏泽', code: '101121701', adcode: '371700', province: '山东省' },
    ],
    '河南省': [
        { name: '郑州', code: '101180101', adcode: '410100', province: '河南省' },
        { name: '开封', code: '101180201', adcode: '410200', province: '河南省' },
        { name: '洛阳', code: '101180301', adcode: '410300', province: '河南省' },
        { name: '平顶山', code: '101180401', adcode: '410400', province: '河南省' },
        { name: '安阳', code: '101180501', adcode: '410500', province: '河南省' },
        { name: '鹤壁', code: '101180601', adcode: '410600', province: '河南省' },
        { name: '新乡', code: '101180701', adcode: '410700', province: '河南省' },
        { name: '焦作', code: '101180801', adcode: '410800', province: '河南省' },
        { name: '濮阳', code: '101180901', adcode: '410900', province: '河南省' },
        { name: '许昌', code: '101181001', adcode: '411000', province: '河南省' },
        { name: '漯河', code: '101181101', adcode: '411100', province: '河南省' },
        { name: '三门峡', code: '101181201', adcode: '411200', province: '河南省' },
        { name: '南阳', code: '101181301', adcode: '411300', province: '河南省' },
        { name: '商丘', code: '101181401', adcode: '411400', province: '河南省' },
        { name: '信阳', code: '101181501', adcode: '411500', province: '河南省' },
        { name: '周口', code: '101181601', adcode: '411600', province: '河南省' },
        { name: '驻马店', code: '101181701', adcode: '411700', province: '河南省' },
    ],
    '湖北省': [
        { name: '武汉', code: '101200101', adcode: '420100', province: '湖北省' },
        { name: '黄石', code: '101200201', adcode: '420200', province: '湖北省' },
        { name: '十堰', code: '101200301', adcode: '420300', province: '湖北省' },
        { name: '宜昌', code: '101200401', adcode: '420500', province: '湖北省' },
        { name: '襄阳', code: '101200501', adcode: '420600', province: '湖北省' },
        { name: '鄂州', code: '101200601', adcode: '420700', province: '湖北省' },
        { name: '荆门', code: '101200701', adcode: '420800', province: '湖北省' },
        { name: '孝感', code: '101200801', adcode: '420900', province: '湖北省' },
        { name: '荆州', code: '101200901', adcode: '421000', province: '湖北省' },
        { name: '黄冈', code: '101201001', adcode: '421100', province: '湖北省' },
        { name: '咸宁', code: '101201101', adcode: '421200', province: '湖北省' },
        { name: '随州', code: '101201201', adcode: '421300', province: '湖北省' },
    ],
    '湖南省': [
        { name: '长沙', code: '101250101', adcode: '430100', province: '湖南省' },
        { name: '株洲', code: '101250201', adcode: '430200', province: '湖南省' },
        { name: '湘潭', code: '101250301', adcode: '430300', province: '湖南省' },
        { name: '衡阳', code: '101250401', adcode: '430400', province: '湖南省' },
        { name: '邵阳', code: '101250501', adcode: '430500', province: '湖南省' },
        { name: '岳阳', code: '101250601', adcode: '430600', province: '湖南省' },
        { name: '常德', code: '101250701', adcode: '430700', province: '湖南省' },
        { name: '张家界', code: '101250801', adcode: '430800', province: '湖南省' },
        { name: '益阳', code: '101250901', adcode: '430900', province: '湖南省' },
        { name: '郴州', code: '101251001', adcode: '431000', province: '湖南省' },
        { name: '永州', code: '101251101', adcode: '431100', province: '湖南省' },
        { name: '怀化', code: '101251201', adcode: '431200', province: '湖南省' },
        { name: '娄底', code: '101251301', adcode: '431300', province: '湖南省' },
    ],
    '广东省': [
        { name: '广州', code: '101280101', adcode: '440100', province: '广东省' },
        { name: '韶关', code: '101280201', adcode: '440200', province: '广东省' },
        { name: '深圳', code: '101280601', adcode: '440300', province: '广东省' },
        { name: '珠海', code: '101280701', adcode: '440400', province: '广东省' },
        { name: '汕头', code: '101280501', adcode: '440500', province: '广东省' },
        { name: '佛山', code: '101280800', adcode: '440600', province: '广东省' },
        { name: '江门', code: '101281001', adcode: '440700', province: '广东省' },
        { name: '湛江', code: '101281401', adcode: '440800', province: '广东省' },
        { name: '茂名', code: '101281601', adcode: '440900', province: '广东省' },
        { name: '肇庆', code: '101280901', adcode: '441200', province: '广东省' },
        { name: '惠州', code: '101280301', adcode: '441300', province: '广东省' },
        { name: '梅州', code: '101280401', adcode: '441400', province: '广东省' },
        { name: '汕尾', code: '101281101', adcode: '441500', province: '广东省' },
        { name: '河源', code: '101281201', adcode: '441600', province: '广东省' },
        { name: '阳江', code: '101281701', adcode: '441700', province: '广东省' },
        { name: '清远', code: '101281301', adcode: '441800', province: '广东省' },
        { name: '东莞', code: '101281901', adcode: '441900', province: '广东省' },
        { name: '中山', code: '101281501', adcode: '442000', province: '广东省' },
        { name: '潮州', code: '101281801', adcode: '445100', province: '广东省' },
        { name: '揭阳', code: '101282001', adcode: '445200', province: '广东省' },
        { name: '云浮', code: '101282101', adcode: '445300', province: '广东省' },
    ],
    '广西壮族自治区': [
        { name: '南宁', code: '101300101', adcode: '450100', province: '广西壮族自治区' },
        { name: '柳州', code: '101300201', adcode: '450200', province: '广西壮族自治区' },
        { name: '桂林', code: '101300501', adcode: '450300', province: '广西壮族自治区' },
        { name: '梧州', code: '101300401', adcode: '450400', province: '广西壮族自治区' },
        { name: '北海', code: '101300701', adcode: '450500', province: '广西壮族自治区' },
        { name: '防城港', code: '101301001', adcode: '450600', province: '广西壮族自治区' },
        { name: '钦州', code: '101300901', adcode: '450700', province: '广西壮族自治区' },
        { name: '贵港', code: '101300801', adcode: '450800', province: '广西壮族自治区' },
        { name: '玉林', code: '101300601', adcode: '450900', province: '广西壮族自治区' },
        { name: '百色', code: '101300301', adcode: '451000', province: '广西壮族自治区' },
        { name: '贺州', code: '101301101', adcode: '451100', province: '广西壮族自治区' },
        { name: '河池', code: '101301201', adcode: '451200', province: '广西壮族自治区' },
        { name: '来宾', code: '101301301', adcode: '451300', province: '广西壮族自治区' },
        { name: '崇左', code: '101301401', adcode: '451400', province: '广西壮族自治区' },
    ],
    '海南省': [
        { name: '海口', code: '101310101', adcode: '460100', province: '海南省' },
        { name: '三亚', code: '101310201', adcode: '460200', province: '海南省' },
        { name: '三沙', code: '101310301', adcode: '460300', province: '海南省' },
        { name: '儋州', code: '101310401', adcode: '460400', province: '海南省' },
    ],
    '重庆市': [
        { name: '重庆', code: '101040100', adcode: '500000', province: '重庆市' },
    ],
    '四川省': [
        { name: '成都', code: '101270101', adcode: '510100', province: '四川省' },
        { name: '自贡', code: '101270301', adcode: '510300', province: '四川省' },
        { name: '攀枝花', code: '101270401', adcode: '510400', province: '四川省' },
        { name: '泸州', code: '101270501', adcode: '510500', province: '四川省' },
        { name: '德阳', code: '101270601', adcode: '510600', province: '四川省' },
        { name: '绵阳', code: '101270701', adcode: '510700', province: '四川省' },
        { name: '广元', code: '101270801', adcode: '510800', province: '四川省' },
        { name: '遂宁', code: '101270901', adcode: '510900', province: '四川省' },
        { name: '内江', code: '101271001', adcode: '511000', province: '四川省' },
        { name: '乐山', code: '101271101', adcode: '511100', province: '四川省' },
        { name: '南充', code: '101271201', adcode: '511300', province: '四川省' },
        { name: '眉山', code: '101271301', adcode: '511400', province: '四川省' },
        { name: '宜宾', code: '101271401', adcode: '511500', province: '四川省' },
        { name: '广安', code: '101271501', adcode: '511600', province: '四川省' },
        { name: '达州', code: '101271601', adcode: '511700', province: '四川省' },
        { name: '雅安', code: '101271701', adcode: '511800', province: '四川省' },
        { name: '巴中', code: '101271801', adcode: '511900', province: '四川省' },
        { name: '资阳', code: '101271901', adcode: '512000', province: '四川省' },
    ],
    '贵州省': [
        { name: '贵阳', code: '101260101', adcode: '520100', province: '贵州省' },
        { name: '六盘水', code: '101260201', adcode: '520200', province: '贵州省' },
        { name: '遵义', code: '101260301', adcode: '520300', province: '贵州省' },
        { name: '安顺', code: '101260401', adcode: '520400', province: '贵州省' },
        { name: '毕节', code: '101260501', adcode: '520500', province: '贵州省' },
        { name: '铜仁', code: '101260601', adcode: '520600', province: '贵州省' },
    ],
    '云南省': [
        { name: '昆明', code: '101290101', adcode: '530100', province: '云南省' },
        { name: '曲靖', code: '101290301', adcode: '530300', province: '云南省' },
        { name: '玉溪', code: '101290401', adcode: '530400', province: '云南省' },
        { name: '保山', code: '101290501', adcode: '530500', province: '云南省' },
        { name: '昭通', code: '101290601', adcode: '530600', province: '云南省' },
        { name: '丽江', code: '101290701', adcode: '530700', province: '云南省' },
        { name: '普洱', code: '101290801', adcode: '530800', province: '云南省' },
        { name: '临沧', code: '101290901', adcode: '530900', province: '云南省' },
    ],
    '西藏自治区': [
        { name: '拉萨', code: '101140101', adcode: '540100', province: '西藏自治区' },
        { name: '日喀则', code: '101140201', adcode: '540200', province: '西藏自治区' },
        { name: '昌都', code: '101140301', adcode: '540300', province: '西藏自治区' },
        { name: '林芝', code: '101140401', adcode: '540400', province: '西藏自治区' },
        { name: '山南', code: '101140501', adcode: '540500', province: '西藏自治区' },
        { name: '那曲', code: '101140601', adcode: '540600', province: '西藏自治区' },
    ],
    '陕西省': [
        { name: '西安', code: '101110101', adcode: '610100', province: '陕西省' },
        { name: '铜川', code: '101110201', adcode: '610200', province: '陕西省' },
        { name: '宝鸡', code: '101110301', adcode: '610300', province: '陕西省' },
        { name: '咸阳', code: '101110401', adcode: '610400', province: '陕西省' },
        { name: '渭南', code: '101110501', adcode: '610500', province: '陕西省' },
        { name: '延安', code: '101110601', adcode: '610600', province: '陕西省' },
        { name: '汉中', code: '101110701', adcode: '610700', province: '陕西省' },
        { name: '榆林', code: '101110801', adcode: '610800', province: '陕西省' },
        { name: '安康', code: '101110901', adcode: '610900', province: '陕西省' },
        { name: '商洛', code: '101111001', adcode: '611000', province: '陕西省' },
    ],
    '甘肃省': [
        { name: '兰州', code: '101160101', adcode: '620100', province: '甘肃省' },
        { name: '嘉峪关', code: '101161401', adcode: '620200', province: '甘肃省' },
        { name: '金昌', code: '101160201', adcode: '620300', province: '甘肃省' },
        { name: '白银', code: '101160301', adcode: '620400', province: '甘肃省' },
        { name: '天水', code: '101160401', adcode: '620500', province: '甘肃省' },
        { name: '武威', code: '101160501', adcode: '620600', province: '甘肃省' },
        { name: '张掖', code: '101160601', adcode: '620700', province: '甘肃省' },
        { name: '平凉', code: '101160701', adcode: '620800', province: '甘肃省' },
        { name: '酒泉', code: '101160801', adcode: '620900', province: '甘肃省' },
        { name: '庆阳', code: '101160901', adcode: '621000', province: '甘肃省' },
        { name: '定西', code: '101161001', adcode: '621100', province: '甘肃省' },
        { name: '陇南', code: '101161101', adcode: '621200', province: '甘肃省' },
    ],
    '青海省': [
        { name: '西宁', code: '101150101', adcode: '630100', province: '青海省' },
        { name: '海东', code: '101150201', adcode: '630200', province: '青海省' },
    ],
    '宁夏回族自治区': [
        { name: '银川', code: '101170101', adcode: '640100', province: '宁夏回族自治区' },
        { name: '石嘴山', code: '101170201', adcode: '640200', province: '宁夏回族自治区' },
        { name: '吴忠', code: '101170301', adcode: '640300', province: '宁夏回族自治区' },
        { name: '固原', code: '101170401', adcode: '640400', province: '宁夏回族自治区' },
        { name: '中卫', code: '101170501', adcode: '640500', province: '宁夏回族自治区' },
    ],
    '新疆维吾尔自治区': [
        { name: '乌鲁木齐', code: '101130101', adcode: '650100', province: '新疆维吾尔自治区' },
        { name: '克拉玛依', code: '101130201', adcode: '650200', province: '新疆维吾尔自治区' },
        { name: '吐鲁番', code: '101130301', adcode: '650400', province: '新疆维吾尔自治区' },
        { name: '哈密', code: '101130401', adcode: '650500', province: '新疆维吾尔自治区' },
    ],
    '香港特别行政区': [
        { name: '香港', code: '101320101', adcode: '810000', province: '香港特别行政区' },
    ],
    '澳门特别行政区': [
        { name: '澳门', code: '101330101', adcode: '820000', province: '澳门特别行政区' },
    ],
    '台湾省': [
        { name: '台北', code: '101340101', adcode: '710100', province: '台湾省' },
    ],
};

// 获取所有省份列表
export function getProvinces(): string[] {
    return Object.keys(CHINA_CITIES);
}

// 根据省份获取城市列表
export function getCitiesByProvince(province: string): City[] {
    return CHINA_CITIES[province] || [];
}

// 搜索城市（支持城市名称搜索）
export function searchCities(query: string): City[] {
    if (!query.trim()) return [];

    const results: City[] = [];
    const lowerQuery = query.toLowerCase();

    Object.values(CHINA_CITIES).forEach(cities => {
        cities.forEach(city => {
            if (city.name.toLowerCase().includes(lowerQuery)) {
                results.push(city);
            }
        });
    });

    return results;
}

// 根据城市代码获取城市信息
export function getCityByCode(code: string): City | undefined {
    for (const cities of Object.values(CHINA_CITIES)) {
        const city = cities.find(c => c.code === code);
        if (city) return city;
    }
    return undefined;
}

// 根据城市名称获取城市信息
export function getCityByName(name: string): City | undefined {
    for (const cities of Object.values(CHINA_CITIES)) {
        const city = cities.find(c => c.name === name);
        if (city) return city;
    }
    return undefined;
}
