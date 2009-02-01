package ChartObjects {
	import ChartObjects.Elements.Element;
	import ChartObjects.Elements.PointDotBase;
	import string.Utils;
	import flash.display.BlendMode;
	import flash.geom.Point;
	
	public class AreaBase extends LineBase {
		
		public function AreaBase( json:Object ) {
			
			this.style = {
				values:			[],
				width:			2,
				colour:			'#3030d0',
				fill:			'#3030d0',
				text:			'',		// <-- default not display a key
				'dot-size':		5,
				'halo-size':	2,
				'font-size':	10,
				'fill-alpha':	0.6,
				tip:			'#val#',
				'line-style':	new LineStyle( json['line-style'] ),
				loop:			false		// < for radar charts
			};
			
			object_helper.merge_2( json, this.style );

			if( this.style.fill == '' )
				this.style.fill = this.style.colour;
				
			this.style.colour = string.Utils.get_colour( this.style.colour );
			this.style.fill = string.Utils.get_colour( this.style.fill );
			
			this.key = style.text;
			this.font_size = style['font-size'];
			this.values = style['values'];
			this.add_values();
			
			//
			// so the mask child can punch a hole through the line
			//
			this.blendMode = BlendMode.LAYER;
		}
		
		//
		// called from the base object
		//
		protected override function get_element( index:Number, value:Object ): Element {
			
			var s:Object = this.merge_us_with_value_object( value );

			return new ChartObjects.Elements.Point( index, s );
		}
		
		public override function resize(sc:ScreenCoordsBase):void {
			
			this.graphics.clear();
			// now draw the line + hollow dots
			super.resize(sc);
			
			var x:Number;
			var y:Number;
			var last:PointDotBase;
			var first:Boolean = true;
			
			for ( var i:Number = 0; i < this.numChildren; i++ ) {
				
				//
				// filter out the masks
				//
				if( this.getChildAt(i) is PointDotBase ) {
					
					var e:PointDotBase = this.getChildAt(i) as PointDotBase;
					
					// tell the point where it is on the screen
					// we will use this info to place the tooltip
					var p:flash.geom.Point = sc.get_get_x_from_pos_and_y_from_val( e._x, e._y );
					//x = sc.get_x_from_pos(e._x);
					//y = sc.get_y_from_val(e._y);
					
					
					if( first )
					{
						
						
						if (this.style.loop)
						{
							// assume we are in a radar chart
							this.graphics.moveTo( p.x, p.y );
							x = p.x;
							y = p.y;
						}
						else
						{
							// draw line from Y=0 up to Y pos
							this.graphics.moveTo( p.x, sc.get_y_bottom(false) );
							this.graphics.lineTo( p.x, p.y );
						}
						this.graphics.lineStyle(0,0,0);
						this.graphics.beginFill( this.style.fill, this.style['fill-alpha'] );
						first = false;
					}
					else
					{
						this.graphics.lineTo( p.x, p.y );
						last = e;
					}
				}
			}
			
			if ( last != null ) {
				if ( !this.style.loop) {
					this.graphics.lineTo( sc.get_x_from_pos(last._x), sc.get_y_bottom(false) );
				}
			}
				
			this.graphics.endFill();
		}
	}
}