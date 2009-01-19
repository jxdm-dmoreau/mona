package ChartObjects {
	import ChartObjects.Elements.Element;
	import ChartObjects.Elements.PointHollow;
	import string.Utils;
	import flash.display.BlendMode;
	
	public class AreaHollow extends AreaBase {
		
		public function AreaHollow( json:Object ) {
			
			super( json );
		}
		
		//
		// called from the base object
		//
		protected override function get_element( index:Number, value:Object ): Element {
			
			var style:Object = {
				value:			Number(value),
				'dot-size':		this.style['dot-size'],
				colour:			this.style.colour,
				'halo-size':	this.style['halo-size'],
				width:			this.style.width,
				tip:			this.style.tip
			}
			
			return new ChartObjects.Elements.PointHollow( index, style );
		}
	}
}